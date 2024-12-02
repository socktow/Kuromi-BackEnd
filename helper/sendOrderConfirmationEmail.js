const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (order) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 10px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .total {
                        font-weight: bold;
                        text-align: right;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Order Confirmation</h1>
                    <p>Hello ${order.receiverName},</p>
                    <p>Thank you for your order. Below is the details of your order:</p>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Created At:</strong> ${order.createdAt}</p>
                    <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
                    <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
                    <p><strong>Note:</strong> ${order.note ? order.note : "Không có ghi chú nào"}</p>
                    <p><strong>Voucher:</strong> ${order.Voucher ? order.Voucher : "Không có voucher"}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateOrderDetails(order.orderedProducts)}
                        </tbody>
                    </table>
                    <p class="total">Total: ${order.totalBill.toLocaleString("en-US")} VND</p>
                    <p>Thank you for shopping with us!</p>
                </div>
            </body>
            </html>
        `;

        // Tạo message để gửi email
        const message = {
            from: config.email_user,
            to: order.email,
            subject: "Order Confirmation",
            html: htmlContent
        };

        // Gửi email
        const result = await transporter.sendMail(message);
        console.log("Email sent:", result.response);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
const replaceLocalhostWithURL = (url) => {
    return url.replace('http://localhost:4000', 'http://chuchudayne.com');
};

const generateOrderDetails = (products) => {
    let html = '';
    products.forEach(product => {
        const imageUrl = replaceLocalhostWithURL(product.image);
        html += `
            <tr>
                <td><img src="${imageUrl}" style="max-width: 100px; height: auto;"></td> <!-- Chèn hình ảnh vào đây -->
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.total.toLocaleString("en-US")} VND</td>
            </tr>
        `;
    });
    return html;
};

module.exports = sendOrderConfirmationEmail;
