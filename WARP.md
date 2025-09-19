# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for acquisitions management using:

- **Express.js** for the web server framework
- **Drizzle ORM** with **PostgreSQL** (via Neon serverless) for database operations
- **JWT authentication** with secure cookie-based sessions
- **Winston** for structured logging
- **Zod** for request validation
- **ES6 modules** with import path aliases

## Development Commands

### Running the Application

```bash
npm run dev          # Start development server with auto-reload
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint and auto-fix issues
npm run format       # Format code with Prettier
npm run format:check # Check if code is properly formatted
```

### Database Operations

```bash
npm run db:generate  # Generate Drizzle schema migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Architecture & Structure

### Import Path Aliases

The project uses ES6 import aliases defined in `package.json`:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Flow

1. **Entry Point**: `src/index.js` loads environment config and starts server
2. **Server Setup**: `src/server.js` starts Express server on configured port
3. **App Configuration**: `src/app.js` configures Express middleware and routes

### Layer Architecture

- **Routes** (`src/routes/`): Define API endpoints and HTTP methods
- **Controllers** (`src/controllers/`): Handle request/response logic and validation
- **Services** (`src/services/`): Business logic and database operations
- **Models** (`src/models/`): Drizzle ORM schema definitions
- **Validations** (`src/validations/`): Zod schema validation
- **Utils** (`src/utils/`): Shared utilities (JWT, cookies, formatting)
- **Config** (`src/config/`): Database connection and logger configuration

### Database Schema

Uses Drizzle ORM with PostgreSQL. Current models:

- **Users**: `id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`

Database connection is managed through Neon serverless PostgreSQL.

### Authentication Flow

- JWT tokens stored in secure HTTP-only cookies
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (user/admin roles)
- Cookie options: httpOnly, secure (production), sameSite strict, 15min maxAge

### Logging Strategy

Winston logger with:

- **Development**: Console output with colorized format
- **Production**: File-based logging (`logs/error.lg`, `logs/combined.log`)
- **HTTP Requests**: Morgan integration with structured logging
- **Error Context**: Stack traces and metadata included

### Environment Configuration

Required environment variables (see `.env.example`):

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (default: info)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret (change in production)

### Code Style Guidelines

ESLint configuration enforces:

- 2-space indentation with switch case indentation
- Single quotes for strings
- Semicolons required
- Unix line endings
- Prefer const/arrow functions
- No unused variables (except prefixed with `_`)

### Security Features

- **helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **JWT**: Stateless authentication
- **Secure Cookies**: httpOnly, secure flags
- **Input Validation**: Zod schemas for all inputs
- **Password Hashing**: bcrypt with salt rounds

### Error Handling

- Global JSON parsing error middleware
- Structured error responses with validation details
- Winston error logging with stack traces
- HTTP status codes follow REST conventions

### API Endpoints

Current endpoints:

- `GET /` - Basic hello endpoint
- `GET /health` - Health check with uptime
- `GET /api` - API status check
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)
