# IGDTUW EDUHub

A comprehensive educational resource management platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## Features

-  **Branch-wise Resources**: Organized study materials for all engineering branches
-  **Semester Management**: Resources categorized by semesters (1-8)
-  **PDF Viewer**: In-app PDF viewing with download options
-  **Role-based Access**: USER, MOD, and ADMIN roles with different permissions
-  **Secure Authentication**: JWT-based authentication system
-  **Resource Upload**: Admin/Mod can upload and manage resources
-  **Subject Management**: Create, edit, and delete subjects
-  **Modern UI**: Dark theme with glassmorphism design

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js + Express
- Prisma ORM
- SQLite Database
- JWT Authentication
- Multer (File Upload)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ER_IGDTUW.git
cd ER_IGDTUW
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

#### Development Mode

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open http://localhost:5173 in your browser

#### Using Docker

```bash
docker-compose up
```

## Default Credentials

- **Admin**: admin@example.com / password123
- **Moderator**: mod@example.com / password123

## Project Structure

```
ER_IGDTUW/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── routes/
│   │   └── api.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   ├── hero.png
│   │   └── library.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── PDFViewer.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Resources.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
└── docker-compose.yml
```

## Available Branches

- Computer Science Engineering (CSE)
- CSE - AI
- AI & ML (AIML)
- Mathematics and Computing (MAC)
- Electronics and Communication (ECE)
- ECE - AI
- Mechanical Engineering Automation (MAE)

## User Roles

### USER
- View and download resources
- Access all subjects and materials

### MOD (Moderator)
- All USER permissions
- Upload resources
- Create new subjects
- Edit subject details
- Delete resources and subjects

### ADMIN
- All MOD permissions
- User management
- Promote/demote users
- Full system access

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/branches` - Get all branches
- `GET /api/subjects` - Get subjects by branch and semester
- `GET /api/subjects/:id` - Get subject details with units
- `POST /api/subjects` - Create new subject (MOD/ADMIN)
- `PUT /api/subjects/:id` - Update subject (MOD/ADMIN)
- `DELETE /api/subjects/:id` - Delete subject (MOD/ADMIN)
- `POST /api/upload` - Upload resource file (MOD/ADMIN)
- `DELETE /api/resources/:id` - Delete resource (MOD/ADMIN)

### Admin
- `GET /api/admin/users` - Get all users (ADMIN)
- `POST /api/admin/promote` - Promote/demote user (ADMIN)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- IGDTUW for inspiration
- All contributors and students using this platform

---

Made with ❤️ for IGDTUW Students
