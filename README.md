# LensCart — Premium Camera eCommerce Store

A full-stack, production-ready eCommerce website for selling cameras built with React + Vite, Node.js/Express, MongoDB, and Tailwind CSS.

![LensCart Preview](https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

### 👤 User Features
- Browse all cameras without logging in
- View detailed camera specs, images, ratings
- Register / Login with JWT authentication
- Add to cart & manage quantities
- Wishlist (save/remove cameras)
- Checkout flow (demo — no payment required)

### 🔐 Admin Features
- Role-based admin dashboard (`/admin`)
- Add / Edit / Delete cameras
- View inventory stats (total, in-stock, value)
- Search and filter products

### 🎨 UI Highlights
- Dark luxury aesthetic — obsidian + gold palette
- Fully responsive (mobile-first)
- Animated page transitions & micro-interactions
- Toast notifications
- Loading skeletons
- Filter sidebar with category & brand filters

---

## 🗂 Project Structure

```
camera-store/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Navbar, CameraCard, Footer, Skeleton
│   │   ├── context/        # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/          # HomePage, CameraDetailPage, AuthPage, CartPage, WishlistPage, AdminPage
│   │   ├── utils/          # api.js (with mock fallback), mockData.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                # Node.js + Express API
│   ├── controllers/        # authController, productController, cartController, wishlistController
│   ├── middleware/         # auth.js (JWT protect + adminOnly)
│   ├── models/             # User.js, Camera.js, Cart.js
│   ├── routes/             # auth.js, products.js, cart.js, wishlist.js
│   ├── server.js
│   ├── seed.js
│   ├── vercel.json
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Option A: Demo Mode (No Backend — Vercel Ready)

The frontend runs fully in demo mode using `localStorage` as the database. No backend needed.

```bash
cd frontend
cp .env.example .env
# .env should have: VITE_DEMO_MODE=true

npm install
npm run dev
```

Visit `http://localhost:5173`

**You can register a new account or create one during signup**

---

### Option B: Full Stack (With MongoDB Backend)

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm install
node seed.js        # Seeds database with 10 sample cameras + admin user
npm run dev         # Starts on http://localhost:5000
```

#### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set: VITE_API_URL=http://localhost:5000/api
# Leave VITE_DEMO_MODE unset or false

npm install
npm run dev         # Starts on http://localhost:5173
```

---

### Option C: Docker (Full Stack)

```bash
# From project root
docker-compose up --build

# Frontend: http://localhost:3000
# API:      http://localhost:5000/api
# Seed DB:
docker-compose exec backend node seed.js
```

---

## ☁️ Deployment

### Frontend → Vercel (Free)

1. Push `frontend/` to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory**: `frontend`
4. Set **Environment Variables**:
   - `VITE_DEMO_MODE=true` (for demo mode, no backend needed)
   - OR `VITE_API_URL=https://your-backend.vercel.app/api`
5. Deploy ✅

### Backend → Render (Free)

1. Push `backend/` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Set **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
6. Deploy ✅

### Backend → Vercel (Serverless)

```bash
cd backend
npm i -g vercel
vercel
# Set environment variables in Vercel dashboard
```

### MongoDB → MongoDB Atlas (Free)

1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Create database user + allow network access from anywhere
3. Copy connection string to `MONGO_URI`

---

## 📦 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | Get all cameras (with filters) |
| GET | `/api/products/:id` | Public | Get camera by ID |
| POST | `/api/products` | Admin | Create camera |
| PUT | `/api/products/:id` | Admin | Update camera |
| DELETE | `/api/products/:id` | Admin | Delete camera |

**Query params for GET /api/products:**
- `category`, `brand`, `search`, `minPrice`, `maxPrice`, `sort` (price_asc | price_desc | rating)

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add item |
| PUT | `/api/cart/item/:cameraId` | User | Update quantity |
| DELETE | `/api/cart/item/:cameraId` | User | Remove item |
| DELETE | `/api/cart/clear` | User | Clear cart |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | User | Get wishlist |
| POST | `/api/wishlist/toggle` | User | Toggle item |

---

## 🗄 Database Schema

### User
```js
{ name, email, password (bcrypt), role: 'user'|'admin', wishlist: [CameraId], createdAt }
```

### Camera
```js
{ name, brand, price, description, specifications: {sensor, resolution, iso, shutterSpeed, autofocus, video, battery, weight, dimensions}, image, stock, category, featured, rating, reviewCount }
```

### Cart
```js
{ userId, items: [{ cameraId, quantity }] }
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS (custom design system) |
| State | Context API (Auth, Cart, Wishlist, Toast) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Deploy | Vercel (frontend + backend), Render, Docker |

---

## 🔑 Creating Admin Accounts

Admins can be created by:
1. Seeding via the backend (`npm run seed`)
2. Registering during development
3. Users and admins can change their passwords in the Profile settings page

> ⚠️ Always change default credentials in production!

---

## 📝 Notes

- The frontend has a **full demo mode** — it works 100% without a backend using `localStorage`. Perfect for Vercel-only deployments.
- All data in demo mode persists in the browser's localStorage.
- The admin can add cameras, edit them, and delete them — all reflected instantly.
- For production, always use a strong `JWT_SECRET` and restrict `CLIENT_URL` CORS.
