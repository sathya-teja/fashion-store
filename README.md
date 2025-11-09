
# 🚀 Fashion Store – Full-Stack E-Commerce Platform (MERN)

[![React](https://img.shields.io/badge/Frontend-React-blue)]() 
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)]() 
[![Express](https://img.shields.io/badge/API-Express-lightgrey)]() 
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)]() 
[![JWT](https://img.shields.io/badge/Auth-JWT-orange)]() 
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-blue)]() 
[![MUI](https://img.shields.io/badge/Design-MUI-007FFF)]() 

🌐 **Live Demo:** https://fashion-store-heo5.onrender.com/

---

## 📚 Table of Contents
1. [Overview](#overview)
2. [Tech Stack Summary](#tech-stack-summary)
3. [Features](#features)
4. [Screenshots](#screenshots)
5. [Project Architecture](#project-architecture)
6. [Environment Variables](#environment-variables)
7. [Installation & Setup](#installation--setup)
8. [Available Scripts](#available-scripts)
9. [API Structure](#api-structure)
10. [Deployment](#deployment)
11. [Future Enhancements](#future-enhancements)
12. [Author](#author)

---

## 📌 Overview
**Fashion Store** is a production-ready full-stack MERN-based e-commerce application. It offers a seamless shopping experience with authentication, cart management, order processing, and an admin dashboard for managing inventory and orders.

---

## 🧱 Tech Stack Summary

| Layer       | Technology Used              |
|------------|-----------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Material UI |
| Backend    | Node.js, Express.js          |
| Database   | MongoDB with Mongoose        |
| Authentication | JWT (JSON Web Token)    |
| Deployment | Render (Backend), Netlify/Vercel (Frontend placeholder) |
| State Management | React Context API     |

---

## ✨ Features

### 🛍 Storefront:
- Product browsing with advanced filters & pagination
- Product details with size, color, and ratings
- Wishlist & Cart with real-time updates
- Search functionality
- Checkout with mock payment integration

### 👤 User Account:
- Register/Login with JWT
- Manage profile & addresses
- View order history
- Submit reviews

### 🔐 Admin Panel:
- Product management (Add, Edit, Delete)
- Order tracking and status updates
- Dashboard analytics (planned)

---

## 🖼 Screenshots

```
![Home Page](public/screenshots/home.png)
![Product Page](public/screenshots/product.png)
![Cart Page](public/screenshots/cart.png)
![Admin Dashboard](public/screenshots/admin.png)
```

---

## 🏗 Project Architecture
```
fashion-store-main/
├─ backend/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  └─ server.js
└─ frontend/
   ├─ public/
   └─ src/
      ├─ components/
      ├─ pages/
      ├─ context/
      ├─ utils/
      ├─ App.jsx
      └─ main.jsx
```

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ⚙ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store-main

# Backend Setup
cd backend
npm install
npm run start

# Frontend Setup
cd ../frontend
npm install
npm run dev
```

---

## 📜 Available Scripts

| Command           | Description             |
|------------------|-------------------------|
| `npm run dev`    | Run frontend in dev mode |
| `npm run start`  | Start backend server     |
| `npm run build`  | Build frontend for production |

---

## 🚀 Deployment
- **Backend**: Render (Node server)
- **Frontend**: Replace with deployed URL once available
- **CORS** & Environment variables are required

---

## 🔮 Future Enhancements
- ✅ Real payment gateway integration (Stripe / Razorpay)
- ✅ Image Cloud Uploads (Cloudinary, S3)
- ✅ Admin Analytics Dashboard
- ✅ SMS/Email notifications

---

## 👤 Author
**Panyam Sathya Teja**  
> Built as a production-ready full-stack portfolio project using professional architecture and best practices.

---
⭐ *If you like this project, consider giving it a star on GitHub!* ⭐


---

## 🌐 Live Deployment Link

| Platform  | URL (Placeholder) |
|-----------|-------------------|
| Frontend (Netlify) | https://fashion-store-heo5.onrender.com |



---

## 📡 API Endpoints (Examples)

### 🔐 Authentication
| Method | Endpoint       | Description       | Body Parameters |
|--------|----------------|-------------------|----------------|
| POST   | `/api/users/login`    | Login user       | `{ email, password }` |
| POST   | `/api/users/register` | Register new user | `{ name, email, password }` |
| GET    | `/api/users/profile`  | Get user profile  | `Authorization: Bearer <token>` |

### 🛍 Products
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/api/products`  | Get all products with filters |
| GET    | `/api/products/:id` | Get product by ID |
| POST   | `/api/products`  | **Admin:** Add new product |

### 🛒 Cart
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/api/cart`      | Get user cart        |
| POST   | `/api/cart/add`  | Add item to cart     |
| PUT    | `/api/cart/update` | Update cart items  |

### 📦 Orders
| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | `/api/orders`  | Place a new order    |
| GET    | `/api/orders/myorders` | Get user orders |

---

## 📬 Example API Request (Login)

```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### ✅ Example Response

```json
{
  "_id": "64ffb70e18f4fd61dcae75e9",
  "name": "John Doe",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🎬 UI Navigation Preview (GIF Placeholders)

Showcasing the user journey through the application to help recruiters and developers quickly understand the app’s usability and flow.

| Feature        | GIF Preview (Placeholder) |
|----------------|---------------------------|
| Home Page Navigation | `frontend/public/gifs/home-navigation.gif` |
| Product Filtering & Details | `frontend/public/gifs/product-filter.gif` |
| Cart & Checkout Flow | `frontend/public/gifs/cart-checkout.gif` |
| Admin Dashboard Overview | `frontend/public/gifs/admin-dashboard.gif` |

---
