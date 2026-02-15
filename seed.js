const db = require('./src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Starting seed...');

        // 1. Create Tables
        const migrationSql = `
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS profile (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            headline VARCHAR(255),
            bio TEXT,
            email VARCHAR(255),
            whatsapp VARCHAR(20),
            resume_url TEXT
        );

        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            tech_stack TEXT[],
            live_url TEXT,
            image_url TEXT
        );

        CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price VARCHAR(100),
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await db.query(migrationSql);
        console.log('Database tables verified/created.');

        // 2. Create Admin
        const email = 'admin@example.com';
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await db.query('DELETE FROM admins');
        await db.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
        console.log('Admin created: admin@example.com / password123');

        // 3. Create initial profile
        await db.query('DELETE FROM profile');
        await db.query(
            'INSERT INTO profile (name, headline, bio, email, whatsapp, resume_url) VALUES ($1, $2, $3, $4, $5, $6)',
            [
                'Alex Dev',
                'Senior Full Stack Engineer',
                'I am a passionate developer with 5+ years of experience building scalable web applications.',
                'alex@example.com',
                '+1234567890',
                'https://example.com/resume.pdf'
            ]
        );
        console.log('Initial profile created.');

        // 4. Create initial projects
        await db.query('DELETE FROM projects');
        await db.query(
            'INSERT INTO projects (title, description, tech_stack, live_url, image_url) VALUES ($1, $2, $3, $4, $5)',
            [
                'E-Commerce Platform',
                'A full-featured online store with payment integration.',
                ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                'https://shop-demo.com',
                'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'
            ]
        );

        // 5. Create initial services
        await db.query('DELETE FROM services');
        await db.query('INSERT INTO services (name, price, description) VALUES ($1, $2, $3)', [
            'Custom Web App', 'Starting at $1000', 'Full-stack development tailored to your business.'
        ]);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed fatal error:', err);
        process.exit(1);
    }
};

seed();
