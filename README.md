# ShopEase - E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (login/register)
- Email verification
- Password reset functionality
- Product browsing and search
- Product categories
- Shopping cart
- Favourites/Wishlist
- Order management
- Address management with primary address
- User profile with order history
- Add products (sellers)
- Product reviews and ratings
- Newsletter subscription
- Payment integration (Razorpay)
- Dark mode support

## Tech Stack

**Frontend:**
- React 19
- Redux Toolkit
- React Router 7
- Tailwind CSS 4
- React Hot Toast
- Axios

**Backend:**
- Node.js
- Express.js 5
- MongoDB with Mongoose
- JWT authentication
- Cloudinary (image upload)
- Razorpay (payments)
- Nodemailer (email)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gopichandu923/e-commerce.git
cd e-commerce
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd client
npm install
```

4. Configure environment variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

5. Run the application

Start server:
```bash
cd server
npm start
```

Start client:
```bash
cd client
npm run dev
```

The server runs on http://localhost:5000
The client runs on http://localhost:5173

## Project Structure

```
e-commerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux state management
│   │   └── utils/          # Utility functions
│   └── public/
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/my-products` - Get seller products
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `POST /api/products/upload` - Upload product image
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Favourites
- `GET /api/favourites` - Get user favourites
- `POST /api/favourites/:productId` - Add to favourites
- `DELETE /api/favourites/:productId` - Remove from favourites

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin)

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:addressId` - Update address
- `DELETE /api/addresses/:addressId` - Delete address
- `PATCH /api/addresses/:addressId/set-main` - Set primary address
- `GET /api/addresses/main` - Get primary address

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/subscribers` - Get subscribers (admin)
- `GET /api/newsletter/subscribers/count` - Get subscriber count (admin)

### Payments
- `POST /api/payments/order` - Create payment order
- `POST /api/payments/verify` - Verify payment

## License

ISC