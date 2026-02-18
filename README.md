# Portfolio Backend API

A Node.js + Express REST API for the portfolio website, backed by PostgreSQL (Neon) and Cloudinary for image uploads.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Neon)
- **Auth:** JWT (JSON Web Tokens)
- **Image Upload:** Cloudinary + Multer
- **Deployment:** Render

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── routes/
│   │   ├── auth.js            # Admin login
│   │   ├── contact.js         # Contact form messages
│   │   ├── profile.js         # Portfolio profile
│   │   ├── projects.js        # Projects CRUD
│   │   ├── services.js        # Services CRUD
│   │   ├── stats.js           # Dashboard stats & view tracking
│   │   └── upload.js          # Image upload to Cloudinary
│   ├── utils/
│   │   └── activityLogger.js  # Logs admin actions to DB
│   └── index.js               # App entry point
├── migrations.sql             # Database schema
├── render.yaml                # Render deployment config
├── .env.example               # Environment variable template
└── package.json
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Database Setup

Run the SQL in `migrations.sql` against your PostgreSQL database to create all tables:

```sql
-- Tables created:
-- admins, profile, projects, services, contacts, page_views, activities
```

To create an admin user, run this in your DB:
```sql
-- First hash your password using bcrypt, then insert:
INSERT INTO admins (email, password_hash) VALUES ('admin@example.com', '<bcrypt_hash>');
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (with auto-reload)
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | No | Get profile data |
| PUT | `/api/profile` | ✅ | Update profile |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | No | Get all projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |

### Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | No | Get all services |
| PUT | `/api/services` | ✅ | Bulk update services |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | No | Send a message |
| GET | `/api/contact` | ✅ | Get all messages |
| DELETE | `/api/contact/:id` | ✅ | Delete a message |

### Stats (Admin Dashboard)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/stats/increment` | No | Increment page view count |
| GET | `/api/stats/dashboard` | ✅ | Get dashboard stats & recent activity |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | ✅ | Upload image to Cloudinary |

---

## Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from the table above in the Render dashboard

> ⚠️ Set `FRONTEND_URL` to your Vercel frontend URL to allow CORS.
