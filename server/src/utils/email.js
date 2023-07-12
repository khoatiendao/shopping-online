const mailer = require('nodemailer');
const MyConstant = require('./myconstant');
const transporter = mailer.createTransport({
    host: 'smtp.gmail.com', // SMTP server của gmail
    port: '465', // port của SMTP server
    secure: 'true', // sử dụng SSL/TLS
    auth: { 
        user: MyConstant.EMAIL_USER,
        pass: MyConstant.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // bỏ qua lỗi self-signed certificate
    }
});
const EmailUtil = {
    send(email, id, token) {
        const text = 'Thanks for signing up, please input these information to activate your account:\n\t .id: ' + id + '\n\t .token' + token;
        return new Promise(function(resolve, reject) {
            const mailOptions = {
                from: MyConstant.EMAIL_USER,
                to: email,
                subject: 'SignUp | Verification',
                text: text
            };
            transporter.sendMail(mailOptions, function(err, result){
                if(err) reject(err);
                resolve(true);
            });
        });
    }
}
module.exports = EmailUtil;