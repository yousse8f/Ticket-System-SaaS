# Ticket System Frontend

A modern React TypeScript frontend for the Technical Support Ticket System.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Login/Register with JWT token management
- **Role-based Access**: Different views for users, support staff, and admins
- **Ticket Management**: Create, view, and manage support tickets
- **Real-time Updates**: Toast notifications and loading states
- **Form Validation**: Comprehensive form validation with react-hook-form
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for HTTP requests
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Date-fns** for date formatting

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── CreateTicket.tsx # Ticket creation form
│   ├── Tickets.tsx     # Ticket listing
│   ├── TicketDetail.tsx # Individual ticket view
│   ├── Profile.tsx     # User profile
│   ├── AdminDashboard.tsx # Admin dashboard
│   └── UserManagement.tsx # User management
├── App.tsx             # Main app component
└── index.tsx           # App entry point
```

## Pages

### Public Pages
- **Login**: User authentication
- **Register**: New user registration

### Protected Pages
- **Dashboard**: Overview with stats and recent tickets
- **Tickets**: List all tickets with filtering
- **Create Ticket**: Form to submit new support requests
- **Ticket Detail**: View and respond to individual tickets
- **Profile**: User profile management

### Admin Pages
- **Admin Dashboard**: System overview and statistics
- **User Management**: Manage users and roles

## Components

### Layout
- Responsive sidebar navigation
- Mobile-friendly design
- Role-based menu items
- User profile section

### Forms
- Form validation with react-hook-form
- Error handling and display
- Loading states
- Responsive design

## Styling

The app uses Tailwind CSS for styling with:
- Custom color palette
- Responsive design utilities
- Custom animations
- Consistent spacing and typography

## State Management

- **AuthContext**: Manages user authentication state
- **Local Storage**: Stores JWT tokens
- **React State**: Component-level state management

## API Integration

- Axios for HTTP requests
- Automatic token inclusion in headers
- Error handling and retry logic
- Request/response interceptors

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent component structure

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Set environment variables for production:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test on multiple screen sizes
4. Update documentation as needed

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS settings include your frontend URL
2. **API Connection**: Check that the backend server is running and accessible
3. **Build Errors**: Clear node_modules and reinstall dependencies

### Development Tips

- Use React DevTools for debugging
- Check the browser console for errors
- Use the Network tab to debug API calls
- Test responsive design on different screen sizes
