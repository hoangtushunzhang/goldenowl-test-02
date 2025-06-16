This project is a fullstack web application for searching and displaying exam scores, built with:
Backend: Laravel (PHP)
Frontend: Next.js (React, TypeScript, TailwindCSS)

Responsive, modern UI
API-based communication between frontend and backend
```

Getting Started
1. Backend (Laravel)
Prerequisites
PHP >= 8.1
Composer
MySQL/PostgreSQL/SQLite (or other supported DB)


Setup:
cd backend
cp .env.example .env
# Edit .env to match your database credentials
composer install
php artisan key:generate
php artisan migrate --seed
php artisan config:clear
php artisan cache:clear
php artisan serve

The backend will run at http://localhost:8000 by default.

2. Frontend (Next.js)
Prerequisites
Node.js >= 18
npm, yarn, or pnpm

Setup:
cd frontend
npm install
npm run dev

The frontend will run at http://localhost:3000 by default.


API Configuration
The frontend expects the backend API to be available at http://localhost:8000.
If you change the backend port or domain, update the API URLs in your frontend code accordingly.