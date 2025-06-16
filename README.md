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

🛠️ Database Setup
This project uses Laravel migrations to manage most of the database schema. However, the diem_thi_thpt table is created manually due to specific data import or structure considerations.

✅ Running Laravel Migrations
To run all standard migrations, use the following command:

php artisan migrate
This will create all necessary tables for the application except diem_thi_thpt.

⚠️ Manually Created Table: diem_thi_thpt
The diem_thi_thpt table is not included in Laravel migration files. It must be created manually in your PostgreSQL database.

📦 SQL to Create Table and Register Migration
sql

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- Create diem_thi_thpt table manually
CREATE TABLE diem_thi_thpt (
    sbd VARCHAR(8) PRIMARY KEY,
    toan DECIMAL(4,2) NULL,
    ngu_van DECIMAL(4,2) NULL,
    ngoai_ngu DECIMAL(4,2) NULL,
    vat_li DECIMAL(4,2) NULL,
    hoa_hoc DECIMAL(4,2) NULL,
    sinh_hoc DECIMAL(4,2) NULL,
    lich_su DECIMAL(4,2) NULL,
    dia_li DECIMAL(4,2) NULL,
    gdcd DECIMAL(4,2) NULL,
    ma_ngoai_ngu VARCHAR(2) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Insert record into migrations table to prevent Laravel from re-running
INSERT INTO migrations (migration, batch) 
VALUES ('2024_03_19_000000_create_diem_thi_thpt_table', 1);
🧠 Important: This setup ensures that Laravel recognizes this table as already migrated and will not attempt to create it again.

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
