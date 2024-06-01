const nodemailer = require("nodemailer");
const config = require("../config.json");

const sendMail = async (username, email, password, verificationLink) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
            user: config.email_user,
            pass: config.email_password
        }
    });

    const subject = "Email Verification";
    const html = `
        <p>You have successfully registered!</p>
        <p><strong>Customer Name:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
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
