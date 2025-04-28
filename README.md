# BlogApp - Full Stack Blogging Platform

BlogApp is a comprehensive, modern blogging platform built with a React frontend and Node.js backend. It features separate client applications for regular users and administrators, allowing for a complete content management experience.

To try the app, create an account [here](https://blog-api-top-production.up.railway.app/).

To view the restricted access Admin Dashboard you can log in using:  
- username: `admin@admin.com`  
- password: `adminpassword`

<img width="500" alt="Screenshot 2025-04-28 at 17 00 50" src="https://github.com/user-attachments/assets/89ddeeda-8136-43af-bd04-b3df9a65d57f" />
<img width="500" alt="Screenshot 2025-04-28 at 17 02 29" src="https://github.com/user-attachments/assets/22298029-e586-43e3-b65c-d3fcead3d9e8" />
<img width="500" alt="Screenshot 2025-04-23 at 22 59 58" src="https://github.com/user-attachments/assets/a2035368-606d-4a87-bd3f-c31c078089a9" />
<img width="500" alt="Screenshot 2025-04-23 at 19 24 10" src="https://github.com/user-attachments/assets/7149cc0f-bd7f-48f4-ba48-93a041d0fd91" />


## Features

### User Features
- Create and manage blog posts
- Toggle between draft and published states
- Comment on posts
- User authentication and profiles
- Responsive design for all devices

### Admin Features
- Comprehensive dashboard with analytics
- Content moderation tools
- User management
- Comment moderation
- Post approval workflow

## Tech Stack

### Frontend
- React 19
- React Router 7
- TailwindCSS 4
- Vite 6

### Backend
- Node.js with Express 5
- PostgreSQL database
- Prisma ORM 6
- JWT authentication
- Caching system for improved performance



## Installation

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- PostgreSQL (v14.x or higher)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexanderjuxoncobb/blog-api-top.git
   cd blog-api-top
   ```

2. **Create and configure environment variables**
   
   Create a `.env` file in the `server` directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/blogapp_db?schema=public"
   JWT_SECRET="your_secret_key"
   NODE_ENV="development"
   CLIENT_URL="http://localhost:5173"
   ADMIN_CLIENT_URL="http://localhost:5174"
   ```
   
   Note: Replace "username", "password", and other values with your own.

3. **Initialize the database**
   
   Make sure PostgreSQL is running, then:
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Install dependencies**
   
   From the project root:
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install user client dependencies
   cd ../client-user
   npm install
   
   # Install admin client dependencies
   cd ../client-admin
   npm install
   ```

5. **Start the development servers**
   
   From the project root:
   ```bash
   npm run dev
   ```
   
   This will start three servers concurrently:
   - Backend API server: http://localhost:8080
   - User client: http://localhost:5173
   - Admin client: http://localhost:5174

## Default Users

After running the seed script, the following users will be available:

- Regular User:
  - Email: user@example.com
  - Password: userpassword

- Admin User:
  - Email: admin@example.com
  - Password: adminpassword

## Production Deployment

1. **Build the application**
   
   From the project root:
   ```bash
   npm run build
   ```

2. **Start the production server**
   
   ```bash
   npm start
   ```
   
   In production mode, the Express server will also serve the frontend static files.

## Development

### Project Structure
```
blogapp/
├── client-admin/       # Admin dashboard React application
├── client-user/        # User-facing React application
├── server/             # Express backend
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── prisma/         # Prisma schema and migrations
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utilities
├── package.json        # Root package.json for scripts
└── README.md           # This file
```

### Running Individual Components

To run components separately:

- Backend API:
  ```bash
  npm run server
  ```

- User Client:
  ```bash
  npm run client-user
  ```

- Admin Client:
  ```bash
  npm run client-admin
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
