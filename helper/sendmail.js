const nodemailer = require("nodemailer");
const config = require("../config.json");

const sendMail = async (username, email, password) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
            user: config.email_user,
            pass: config.email_password
        }
    });

    const subject = "Đăng ký thành công";
    const html = `
        <p>Bạn đã đăng ký thành công!</p>
        <p><strong>Tên Khách Hàng:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
    `;

    const message = {
        from: config.email_user,
        to: email,
        subject: subject,
        html: html
    };

    try {
        const result = await transporter.sendMail(message);
        console.log("Email sent:", result.response);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendMail;
