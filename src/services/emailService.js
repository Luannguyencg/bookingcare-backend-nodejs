require('dotenv').config();
import nodemailer from "nodemailer";




let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Luân Nguyễn 👻" <luannguyen12069@gmail.com>`, // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });

}

let getBodyHTMLEmail = (dataSend)=>{
    let result = ''
    if(dataSend.language === 'vi'){
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Số điện thoại của bạn: ${dataSend.phonenumber}</p>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Luân Nguyễn chanel</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        
        <p>Nếu các thông tin tên là đúng , vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Xin chân thành cảm ơn!!</div>
        `
    }
    if(dataSend.language === 'en'){
        result =`
        <h3>Hello ${dataSend.patientName}</h3>
        <p>Your phone number : ${dataSend.phonenumber}</p>
        <p>You received this email because you booked an online medical appointment on Luân Nguyễn chanel</p>
        <p>Information to book a medical appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        
        <p>If the name information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Sincerely thank !!</div>
        `
    }

    return result;
}  


let sendAttackment = async(dataSend)=>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Luân Nguyễn 👻" <luannguyen12069@gmail.com>`, // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả khám bệnh ✔", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [
            {

                filename: `Remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64',
            }
        ]
    });
}
let getBodyHTMLEmailRemedy = (dataSend)=>{
    let result = ''
    if(dataSend.language === 'vi'){
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        
        <p>Thông tin đơn thuốc hóa đơn được gửi trong file đính kèm</p>
    
       

        <div>Xin chân thành cảm ơn!!</div>
        `
    }
    if(dataSend.language === 'en'){
        result =`
        <h3>Dear ${dataSend.patientName}</h3>
        
        <p>Invoice information sent in attachment</p>
       

        <div>Sincerely thank !!</div>

        `
    }

    return result;
}  




module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttackment:sendAttackment

}      