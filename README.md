# NexStore — MERN Stack Project

Hey! This is **NexStore**, a full-stack e-commerce web application I built using the MERN stack. The main goal of this project was to learn and implement secure authentication with JWT (Access & Refresh tokens), role-based authorization (Admin vs Normal User), image uploads using ImageKit, and clean state management with Redux Toolkit.

---

## Features

- **User Authentication**:
  - Secure signup and login using bcrypt password hashing.
  - Short-lived Access Token (15 mins) stored in Redux state.
  - Long-lived Refresh Token (7 days) stored in secure httpOnly cookie.
  - Automatic token refresh on 401 errors using Axios interceptors.
- **Role-Based Access Control**:
  - **User**: Can browse products, search, and view product details.
  - **Admin**: Has access to an Admin Panel to create, edit, and delete products.
- **Product Management**:
  - Direct image upload to ImageKit via Multer memory storage.
  - Form validation on backend with express-validator and frontend with react-hook-form.
- **UI / UX**: Clean dark theme built with Tailwind CSS, Lucide icons, and React Hot Toast.

---

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, React Hook Form, React Router, Tailwind CSS, Axios, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), ImageKit SDK, Multer, bcryptjs

---

## How to Run Locally

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nexstore-ecommerce
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open another terminal:
```bash
cd client
npm install
npm run dev
```

The app will be live at `http://localhost:5173`.

---

## API Endpoints

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user & get tokens
- `POST /api/auth/refresh-token` — Renew access token via cookie
- `POST /api/auth/logout` — Logout user & clear cookie
- `GET /api/auth/me` — Get current logged-in user profile

### Product Endpoints (`/api/products`)
- `GET /api/products` — Get all products (supports `?search=`)
- `GET /api/products/:id` — Get product details by ID
- `POST /api/products` — Create product with image (Admin only)
- `PUT /api/products/:id` — Update product details / image (Admin only)
- `DELETE /api/products/:id` — Delete product & remove image (Admin only)
