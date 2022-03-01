const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const accountSid = 'ACc40cf15b526d29a8f1eaff131efa90bf'; 
const authToken = '9c9a447775fcc456bfa7013b5b3b4be3'; 
const client = require('twilio')(accountSid, authToken); 

function sendSMS(userPhone, msgBody){
    client.messages 
      .create({         
         to: "+91" + userPhone,
         from:"+19033002704",
         body: msgBody
       }) 
      .then(message => console.log(message.sid)) 
      .done();
}

function calculateCost(req){
    let length = Number(req.body['length'])
    let width = Number(req.body['width'])
    let height = Number(req.body['height'])
    let weight = Number(req.body['weight'])
    let coupon = Number(req.body['coupon'])

    let volume = length*width*height
    let cost = volume/100 + weight + 100
    if (coupon!=''){
        cost -=50
    }
    cost = Math.round(cost)
    return String(cost)

}

// const dotenv = require('dotenv')

// dotenv.config({path:'./.env'})

const dbcon = mysql.createPool({
  host: "localhost",
  user: "root",
  password:  "",
  database:  "parcel_delivery_system",
})


function getOTP(){
    return Math.floor(Math.random()*90000 + 10000)
}

function getTimeInMilliSec(){
    let time = new Date().getTime()
    return time
}


function verifyToken(req, res, next){
    // console.log(req.headers)
    if (!req.headers.authorization){
        return res.status(401).send("Unauthorized request")
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    if (token == null){
        return res.status(401).send("Unauthorized request")
    }
    try{
        let payload = jwt.verify(token, "secretKey!@#$%^&*")
        if (!payload){
            return res.status(401).send("Unauthorized request")
        }
        req.email = payload.subject
        next()
    }
   
    catch{
        return res.status(401).send("Unauthorized request")
    }
}



router.get('/', (req, res) =>{
    res.send("from API route")
})

router.post('/register', (req, res)=>{
    const {email, password, phone} = req.body
    

    let checkIfAlreadyExistsQuery = "SELECT email FROM registeredUsers WHERE email = ? LIMIT 1"

    dbcon.query(checkIfAlreadyExistsQuery, [email], async (err, result, fields)=>{
        console.log(result)
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else if (result.length>=1){
            res.status(409).send("User Already Exists")
        }
        else{
            let otp = getOTP()
            let otp_expiration = String(getTimeInMilliSec() + (300*1000))
            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, salt)
            let registerNewUserQuery = "INSERT INTO registeredUsers SET ?"
            dbcon.query(registerNewUserQuery,{email:email,phone:phone, password:hashedPassword,otp:otp, otp_expiration: otp_expiration} ,(err, result, fields)=>{
                if (err){
                    res.status(500).send("Internal Server Error")
                }
                else{
                    // sendSMS(phone, `You have Successfully Registered to Parcel Delivery System. Your verification code is ${otp}`)

                    let payload = {subject: email}
                    let token = jwt.sign(payload,"secretKey!@#$%^&*")
                    res.status(200).send({token})
                }
            })
        }
    })
   
})


router.post('/login', (req, res)=>{

    const {email, password} = req.body

    let isUserRegisteredQuery = "SELECT email FROM registeredUsers WHERE email = ? LIMIT 1" 
    dbcon.query(isUserRegisteredQuery, [email],(err, result, fields)=>{
        if (err) { 
            res.status(500).send("Internal Server Error")
        }
        else if (result.length == 0) {
            res.status(403).send("User is not Registerd")
        }
        else{
    
            let matchPasswordQuery = "SELECT password, verification_status FROM registeredUsers WHERE email = ? LIMIT 1" 
            dbcon.query(matchPasswordQuery, [email], async (err, result, fields)=>{
                console.log(result[0])
                if (err) { 
                    res.status(500).send("Internal Server Error")
                }
                let isMatch = await bcrypt.compare(password, result[0].password)
                if (!isMatch ) {
                    res.status(401).send("Invalid Email/Password")
                }
                else{
                    let payload = {subject: email}
                    let token = jwt.sign(payload,"secretKey!@#$%^&*")
                    if (result[0].verification_status==false){
                        res.status(200).send({token:token, verification_status:false})
                    }
                    else{
                        res.status(200).send({token:token, verification_status:true})
                    }
                }
            })
        }
    })
})
router.get('/MyOrders', verifyToken, (req, res)=>{
    let getMyOrdersQuery = "SELECT * FROM orders where email = ?"
    dbcon.query(getMyOrdersQuery, [req.email], (err, result)=>{
        if (err){
            console.log(err)
            res.status(500).send("Internal Server Error")
        }
        else if (result.length==0){
            res.status(200).send([])
        }
        else{
            console.log("hi")
            res.status(200).send(result)
        }
    }) 

})

router.get('/getPhone', verifyToken, (req, res) =>{
    // console.log(req.body, req.email)
    let getPhoneQuery = "SELECT phone, verification_status FROM registeredUsers WHERE email = ? LIMIT 1"
    dbcon.query(getPhoneQuery, [req.email], (err, result)=>{
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else if (result.length==0){
            res.status(400).send("Bad Request")
        }
        else if (result[0].verification_status==true){
            res.status(409).send("Already Verified")
        }
        else{
            console.log("hi")
            res.json({phone: result[0].phone})
        }
    }) 
})

router.post('/verifyOTP', verifyToken, (req, res) =>{
    // console.log(req.body, req.email)
    let verifyOTPQuery = "SELECT otp, otp_expiration FROM registeredUsers WHERE email = ? LIMIT 1"
    dbcon.query(verifyOTPQuery, [req.email], (err, result)=>{
        // console.log(getTimeInMilliSec() - result[0].otp_expiration)
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else if (result.length==0){
            res.status(400).send("Bad Request")
        }
        else if (result[0].otp!== req.body.otp){
            res.status(401).send("Invalid OTP")
        }
        else if ( getTimeInMilliSec() - result[0].otp_expiration >(300*1000)){
            res.status(401).send("OTP Expired")
        }
        else{
            let updateOTPStatusQuery = "UPDATE registeredUsers SET verification_status= true WHERE email = ?"
            dbcon.query(updateOTPStatusQuery, [req.email], (err, result)=>{
                if (err){
                    res.status(500).send("Internal Server Error")
                }
                else{
                    res.status(200).send("Verified Successfully")
                }
            })
        }
    }) 
})


router.put('/resendOTP', verifyToken, (req, res) =>{
    // console.log(req.body, req.email)
    let otp = getOTP()
    let otp_expiration = String(getTimeInMilliSec() + (300*1000))
    let resendOTPQuery = "UPDATE registeredUsers SET otp = ?, otp_expiration = ? WHERE email = ?"
    dbcon.query(resendOTPQuery, [otp, otp_expiration, req.email], (err, result)=>{
        console.log(result.changedRows)
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else if (result.changedRows==0){
            res.status(400).send("Bad Request")
        }
        else{
            let getPhoneQuery = "SELECT phone from registeredusers WHERE email = ?"
            dbcon.query(getPhoneQuery, [req.email], (err, result)=>{
                if (err){
                    res.status(500).send("Internal Server Error")
                }
                else if (result.length==0){
                    res.status(400).send("Bad Request")
                }
                else{
                    // sendSMS(result[0].phone,`Your verification code for Parcel Delivery System is ${otp}` )
                    res.status(200).send("OTP Resent Successfully")
                }
            })

        }
    }) 
})

router.get("/authorizeToken", verifyToken, (req, res)=>{
    res.status(200).send("Authorized Token")
})



router.get('/getUserData', verifyToken, (req, res) =>{
    // console.log(req.body, req.email)
    let getUserDataQuery = "SELECT * FROM userDetails WHERE email = ? LIMIT 1"
    dbcon.query(getUserDataQuery, [req.email], (err, result)=>{
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else if (result.length==0){
            res.json({email: req.email})
        }
        else{
            // console.log("hi")
            res.json(result[0])
        }
    }) 
})


router.post('/updateProfile', verifyToken, (req, res) =>{
  

    let updateProfileQuery = "INSERT INTO userDetails SET ? ON DUPLICATE KEY UPDATE ?"
    req.body['email'] = req.email
    dbcon.query(updateProfileQuery, [req.body, req.body], (err, result)=>{
        if (err){
            res.status(500).send("Internal Server Error")
        }
        else{
            res.status(200).send("Profile Updated Successfully")
        }
    }) 
})


router.post('/newOrder', verifyToken, (req, res) =>{
  
    // console.log(req.body)
    let newOrderQuery = "INSERT INTO orders SET ?"
    req.body['email'] = req.email
    req.body['imagePath'] = "try"
    let cost = calculateCost(req)
    req.body['cost'] = cost
    req.body['status'] = "Our agent is out for picking up your parcel"
    delete req.body['coupon'];

    dbcon.query(newOrderQuery, [req.body], (err, result)=>{
        if (err){
            // console.log(err)
            res.status(500).send("Internal Server Error")
        }
        else{
            // console.log("done")
            res.status(200).send("Order Received Successfully")
        }
    }) 
})

router.post('/getOrderCost', verifyToken, (req, res) =>{
    let cost = calculateCost(req)
    res.status(200).send({cost:cost})
})


router.post('/trackOrder', verifyToken, (req, res)=>{
    let TrackOrderQuery = "SELECT status FROM orders where email = ? and orderID =?"
    // console.log(req.body)
    let orderID = req.body['orderID']
    // console.log(orderID)
    dbcon.query(TrackOrderQuery, [req.email, orderID], (err, result)=>{
        // console.log(result)
        if (err){
            // console.log(err)
            res.status(500).send("Internal Server Error")
        }
        else if (result.length==0){
            res.status(404).send("order does not exist")
        }
        else{
            // console.log("hi")
            res.status(200).send(result[0])
        }
    }) 

})


module.exports = router