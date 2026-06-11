# RideFlow - Full Stack Cab Booking Application

RideFlow is a production-ready MERN cab booking platform with rider, driver, and admin roles. It includes JWT authentication, role-based access, ride booking, fare estimates, live Socket.io events, driver availability, mock payments, reviews, Cloudinary-ready uploads, and analytics dashboards.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM, Axios, React Hot Toast, Recharts, Framer Motion, Socket.io Client
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, Socket.io, Cloudinary, Multer
- Maps: Google Maps API-ready environment variables

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rideflow
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

3. Seed vehicle pricing and default admin:

```bash
npm run seed
```

Default admin after seeding:

```text
admin@rideflow.com
Admin@12345
```

4. Run development servers:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Features

- Rider: profile, book ride, pickup/drop fields, fare estimate, nearby drivers, ride history, cancel ride, favorite locations API, rate driver API
- Driver: registration, document upload API, online/offline status, accept/cancel/start/complete ride, earnings dashboard, ride history
- Admin: users, drivers, vehicles, rides, payments, revenue and trip analytics
- Real-time: live ride requests, driver acceptance, ride status, driver availability, notifications
- Payment: mock payment methods for UPI, credit card, debit card, and cash

## Main API Routes

- `/api/auth`
- `/api/users`
- `/api/drivers`
- `/api/vehicles`
- `/api/rides`
- `/api/payments`
- `/api/reviews`
- `/api/analytics`

## Deployment Guide

- Deploy `server/` to Render, Railway, Fly.io, or any Node host with WebSocket support.
- Set all production environment variables on the backend host.
- Deploy `client/` to Vercel, Netlify, or static hosting after `npm run build --workspace client`.
- Set `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend.
- Configure `CLIENT_URL` on the backend to the deployed frontend origin.
- Use Cloudinary credentials for production file uploads.
- Use a persistent MongoDB Atlas database and run `npm run seed` once after deployment.
