# BlogApp

A full-stack blogging platform where users can create, edit, and delete 
posts with image uploads, and engage through comments.

## Live Demo
**Frontend:** https://blog-app.vercel.app  
**Backend API:** https://blog-app-api.onrender.com

## Features
- JWT-based user authentication (signup, login, logout)
- Create, edit, and delete blog posts with cover image upload
- Comment on posts and delete your own comments
- Author-only controls (edit/delete) enforced on both frontend and backend
- Persistent image storage via Cloudinary
- Responsive layout

## Tech Stack
**Frontend:** React, React Router, Axios, Vite  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**Image Storage:** Cloudinary  
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure
blog-app/
client/     # React frontend
server/     # Express backend

## Local Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### Backend
```bash
cd server
npm install
```

Create `server/.env`:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173

```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
```

Create `client/.env`:
VITE_API_URL=http://localhost:5000/api

```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |

### Posts
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/posts | Public |
| GET | /api/posts/:id | Public |
| POST | /api/posts | Protected |
| PUT | /api/posts/:id | Protected + Author |
| DELETE | /api/posts/:id | Protected + Author |

### Comments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/posts/:postId/comments | Public |
| POST | /api/posts/:postId/comments | Protected |
| DELETE | /api/posts/:postId/comments/:id | Protected + Author |