# Technical Support Ticket System

A full-stack web application for managing technical support tickets with user authentication, role-based access control, and a modern React frontend.

## Features

- **User Authentication**: Login/Register with JWT tokens
- **Role-based Access**: User, Admin, and Support roles
- **Ticket Management**: Create, view, and manage support tickets
- **User Management**: Admin can manage users
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- React Hook Form for form handling
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security headers
- Morgan for logging

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ticket-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ticket-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows (if installed as a service)
   Start-Service MongoDB
   
   # Or start manually
   mongod --dbpath "C:\data\db"
   ```

### Running the Application

#### Option 1: Run both client and server together
```bash
npm start
```

#### Option 2: Run separately
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

#### Option 3: Development mode (with auto-restart)
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Tickets
- `GET /api/tickets` - Get all tickets (filtered by user role)
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Default Users

The system comes with some default users for testing:

- **Admin**: admin@example.com / password123
- **Support**: support@example.com / password123
- **User**: user@example.com / password123

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── index.js            # Server entry point
└── package.json            # Root package.json
```

## Troubleshooting

### MongoDB Connection Issues
If you see MongoDB connection errors:
1. Make sure MongoDB is installed and running
2. Check if the MongoDB service is started
3. Verify the connection string in the `.env` file

### Port Already in Use
If ports 3000 or 5000 are already in use:
1. Kill the processes using those ports
2. Or change the ports in the configuration files

### TypeScript Errors
If you see TypeScript errors:
1. Make sure all dependencies are installed with `--legacy-peer-deps`
2. Restart the TypeScript server in your IDE
3. Clear the node_modules and reinstall if needed

## Development

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create new API routes in `server/routes/`
4. Add new models in `server/models/`

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for better UX

## License

This project is licensed under the ISC License. # Ticket-System-SaaS
