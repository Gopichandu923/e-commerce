# ShopEZ - E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (login/register)
- Product browsing and search
- Shopping cart
- Order management
- Address management
- User profile with order history
- Add products ( sellers)
- Dark mode support

## Tech Stack

**Frontend:**
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Cloudinary (image upload)
- Razorpay (payments)

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
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux state management
│   │   └── utils/         # Utility functions
│   └── public/
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   └── routes/           # API routes
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## License

ISC
