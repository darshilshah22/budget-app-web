# Budget Tracking Application Backend

A robust Node.js backend for a budget tracking application built with Express.js, TypeScript, and MongoDB.

## Features

### Core Features
1. **Transaction Management**
   - Add, read, update, and delete transactions
   - Support for both income and expenses
   - Categorization of transactions
   - Transaction tagging
   - Date tracking

2. **Budget Management**
   - Create and manage budgets by category
   - Support for different budget periods (daily, weekly, monthly, yearly)
   - Budget tracking and progress monitoring
   - Budget alerts and notifications

3. **Category Management**
   - Custom categories for income and expenses
   - Default categories provided
   - Category customization with icons and colors
   - Category-based reporting

### Additional Features
1. **User Management**
   - User authentication and authorization
   - Secure password handling
   - User preferences (currency, timezone)
   - Profile management

2. **Reporting and Analytics**
   - Expense/Income trends
   - Category-wise spending analysis
   - Budget vs. actual spending comparison
   - Monthly/yearly reports
   - Export functionality

3. **Security Features**
   - JWT-based authentication
   - Password hashing
   - Rate limiting
   - Input validation
   - CORS protection
   - Helmet security headers

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Winston for logging
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budget-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

5. Start the development server:
```bash
npm run dev
```

## API Documentation

The API documentation will be available at `/api-docs` when running the server.

### Main Endpoints

- `/api/transactions` - Transaction management
- `/api/budgets` - Budget management
- `/api/categories` - Category management
- `/api/users` - User management
- `/api/reports` - Reporting and analytics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── index.ts        # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 