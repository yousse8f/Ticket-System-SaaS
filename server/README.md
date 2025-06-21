# Ticket System Backend

A comprehensive technical support ticket system built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Ticket Management**: Create, read, update, and delete support tickets
- **Response System**: Add responses to tickets with internal note support
- **Status Tracking**: Track ticket status (open, in-progress, waiting-for-customer, resolved, closed)
- **Priority Levels**: Support for low, medium, high, and urgent priorities
- **Category System**: Organize tickets by technical, billing, feature-request, bug-report, general
- **Assignment System**: Assign tickets to support staff
- **Satisfaction Rating**: Allow customers to rate resolved tickets
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient pagination for large datasets
- **User Management**: Admin tools for user management and statistics

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticket-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Tickets

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets (with filtering/pagination)
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket
- `POST /api/tickets/:id/responses` - Add response to ticket
- `PUT /api/tickets/:id/assign` - Assign ticket to support staff
- `POST /api/tickets/:id/satisfaction` - Rate ticket satisfaction
- `DELETE /api/tickets/:id` - Delete ticket (Admin only)

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/:id/tickets` - Get tickets created by user
- `GET /api/users/stats/overview` - Get user statistics (Admin only)
- `GET /api/users/support/staff` - Get support staff list

## User Roles

- **user**: Regular customers who can create tickets and view their own tickets
- **support**: Support staff who can view, respond to, and manage tickets
- **admin**: Administrators with full system access

## Data Models

### User
- name, email, password
- role (user/support/admin)
- company, phone
- isActive, lastLogin
- timestamps

### Ticket
- title, description
- category, priority, status
- creator, assignedTo
- responses (array with author, content, isInternal)
- tags, attachments
- dueDate, resolvedAt, closedAt
- satisfaction, satisfactionComment
- timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Error Handling

- Comprehensive error handling with appropriate HTTP status codes
- Validation errors with detailed messages
- MongoDB error handling
- JWT token validation

## Development

The server uses:
- **Express.js** for the web framework
- **Mongoose** for MongoDB ODM
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **express-validator** for input validation
- **helmet** for security headers
- **morgan** for HTTP request logging
- **cors** for cross-origin resource sharing

## Testing

To test the API endpoints, you can use tools like:
- Postman
- Insomnia
- curl commands
- Frontend application

## Production Deployment

For production deployment:
1. Set appropriate environment variables
2. Use a production MongoDB instance
3. Set up proper logging
4. Configure CORS for your domain
5. Use HTTPS
6. Set up monitoring and error tracking 