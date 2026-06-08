# Smart College Placement Management System

A production-oriented MERN SaaS starter for managing college placements across students, recruiters, placement officers, and admins.

## Tech Stack

- React, React Router, Redux Toolkit, Axios, Tailwind CSS, Recharts
- Node.js, Express.js, MongoDB, Mongoose
- JWT access and refresh tokens, bcrypt, RBAC
- Socket.IO real-time notifications
- Multer resume/profile uploads
- Nodemailer email automation
- Helmet, CORS, rate limiting, validation, centralized error handling

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    repositories/
    routes/
    services/
    socket/
    utils/
frontend/
  src/
    components/
    contexts/
    hooks/
    layouts/
    pages/
    services/
    store/
```

## Quick Start

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

Backend runs on `http://localhost:5000` and frontend runs on `http://localhost:5173`.

## Core Features

- Role-specific dashboards for students, recruiters, placement officers, and admins
- JWT authentication with refresh tokens, email verification, forgot/reset password
- Student profiles, multiple resumes, default resume handling, ATS analysis
- Company management and recruiter approval flow
- Job posting, search/filtering, saved jobs, eligibility checks, applications
- Interviews, offers, application timeline tracking
- Real-time and email notifications
- Announcements, audit logs, analytics, placement probability scoring
- Auto job expiry scheduler

## Deployment

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
