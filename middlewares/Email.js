const nodemailer = require("nodemailer");

const sendEmail = async (name ,email, subject, random) => {
    console.log(name, email, subject, random)
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: "ammarabid890@gmail.com",
                pass: "pumkhxtpgecopcgx",
            }
        });
     
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html:`
            <h1>Hi ${name} your</h1>
            <h2>Reset Password OTP</h2>
            <h3 style={{color:"green"}}>${random}</h3>            
            `
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;