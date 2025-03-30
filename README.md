# Kuromi Store Backend

## Introduction
Kuromi Store Backend is a Node.js-based RESTful API service for an e-commerce platform specializing in men's, women's, and children's clothing. The backend provides comprehensive APIs for product management, order processing, user authentication, and payment integration.

## Libraries & Dependencies
- **Core:**
  - Express.js (^4.19.2) - Web framework
  - Mongoose (^8.3.3) - MongoDB ODM
  - dotenv (^16.4.5) - Environment variables management
  - cors (^2.8.5) - Cross-origin resource sharing

- **Authentication & Security:**
  - bcrypt (^5.1.1) - Password hashing
  - jsonwebtoken (^9.0.2) - JWT authentication
  - validator (^13.12.0) - Input validation

- **Payment Integration:**
  - Momo Payment Gateway
  - Zalo Payment Gateway
  - crypto-js (^4.2.0) - Cryptographic functions

- **Additional Features:**
  - nodemailer (^6.9.13) - Email functionality
  - multer (^1.4.5-lts.1) - File upload handling
  - qrcode (^1.5.3) - QR code generation

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/socktow/Kuromi-BackEnd
   cd Kuromi-BackEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MOMO_ACCESS_KEY=your_momo_access_key
   MOMO_SECRET_KEY=your_momo_secret_key
   ZALO_APP_ID=your_zalo_app_id
   ZALO_KEY1=your_zalo_key1
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /verify-email` - Email verification

### User Management
- `GET /users` - Get all users
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update user profile
- `DELETE /users/:id` - Delete user

### Product Management
- `GET /product` - Get all products
- `GET /newcollections` - Get new collections
- `GET /popularwomen` - Get popular women's items
- `GET /relatedproducts` - Get related products

### Order Management
- `GET /orderData` - Get all orders
- `GET /orderData/:orderNumber` - Get order by order number
- `PATCH /orderData/:orderId` - Update order status

### Shopping Cart
- `GET /api/getcart` - Get user's cart
- `PATCH /api/cartreset` - Reset user's cart

### Payment Integration
- `POST /momo/payment` - Initialize Momo payment
- `POST /momo/checkmomopayment` - Check Momo payment status
- `POST /zalo/payment` - Initialize Zalo payment
- `POST /zalo/checkzalopayment` - Check Zalo payment status

### Voucher System
- `GET /api/vouchers` - Get all vouchers
- `POST /api/vouchers` - Create new voucher
- `DELETE /api/vouchers/:id` - Delete voucher

## Customization

### Adding New Routes
1. Create a new route file in the `Router` directory
2. Define your routes using Express Router
3. Import and use the router in `index.js`

### Database Schema
- All schemas are located in the `Schema` directory
- Use Mongoose Schema to define your data models

### Payment Integration
- Configure payment credentials in `.env`
- Update payment endpoints in respective router files

## Security Considerations
- All sensitive data is stored in environment variables
- JWT is used for authentication
- Passwords are hashed using bcrypt
- CORS is enabled for frontend communication

## Error Handling
- Global error handling middleware
- Structured error responses
- Input validation using validator library

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
ISC License
