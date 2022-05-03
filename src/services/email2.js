const nodemailer = require('nodemailer');

const fs = require("fs");
const path = require("path");
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:process.env["SMTP_EMAIL"],
        pass:process.env["SMTP_PASS"]
    }
})


let emailer ={};


emailer.resetPassword= async (email,token)=>{
    const reset_password_url =`http://localhost:3003/reset-password/${token}`;
    const emailResp = await transporter.sendMail({
        from:"anshu17singh@gmail.com",
        to:email,
        subject:"Password reset link",
        html:`<div>Click below link to reset your password<br/>
         <a href=${reset_password_url}>Click here to reset password</a></div>`
    });

    return emailResp;
}

module.exports =emailer