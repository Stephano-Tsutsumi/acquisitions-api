# Acquisitions API

A Node.js Express API for acquisitions management with secure authentication and database management using Neon Database.

## Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

## Architecture

This API follows a clean, layered architecture:

- **Express.js** - Web framework
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Database (via Neon Cloud/Local)
- **JWT** - Authentication with secure HTTP-only cookies
- **Winston** - Structured logging
- **Zod** - Runtime type validation

```
┌─────────────────┐
│   Client/UI     │
└─────────┬───────┘
          │ HTTP
┌─────────▼───────┐
│   Routes        │
├─────────────────┤
│   Controllers   │
├─────────────────┤
│   Services      │
├─────────────────┤
│   Models (ORM)  │
└─────────┬───────┘
          │
┌─────────▼───────┐
│   PostgreSQL    │
│   (Neon)        │
└─────────────────┘
```

## Prerequisites

- **Docker** and **Docker Compose**
- **Node.js 20+** (for local development without Docker)
- **Neon Database Account** - [Sign up here](https://neon.tech)

## Development Setup

### 1. Clone and Configure

```bash
git clone <repository-url>
cd acquisitions-api
```

### 2. Get Neon Database Credentials

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or select existing one
3. Get your credentials:
   - `NEON_API_KEY` - From Account Settings → API Keys
   - `NEON_PROJECT_ID` - From your project dashboard
   - `PARENT_BRANCH_ID` - Usually `main` branch ID from project dashboard

### 3. Configure Development Environment

Copy and edit the development environment file:

```bash
cp .env.development .env.development.local
```

Edit `.env.development.local` with your actual Neon credentials:

```bash
# Required: Replace with your actual Neon credentials
NEON_API_KEY=neon_api_1a2b3c4d5e6f7g8h9i0j
NEON_PROJECT_ID=steep-river-12345
PARENT_BRANCH_ID=br-autumn-lake-67890

# Optional: Customize other settings
JWT_SECRET=your-custom-dev-secret
PORT=3000
```

### 4. Start Development Environment

Using Docker Compose (Recommended):

```bash
# Build and start all services (API + Neon Local)
docker-compose -f docker-compose.dev.yml --env-file .env.development.local up --build

# Or run in background
docker-compose -f docker-compose.dev.yml --env-file .env.development.local up --build -d
```

Alternative - Local Development:

```bash
# Install dependencies
npm install

# Start with auto-reload
npm run dev
```

### 5. Verify Setup

- **API Health Check**: http://localhost:3000/health
- **API Status**: http://localhost:3000/api
- **Database**: Neon Local proxy running on `localhost:5432`

### 6. Run Database Migrations

```bash
# Inside the running container
docker exec -it acquisitions-api-dev npm run db:migrate

# Or locally
npm run db:migrate
```

## Production Deployment

### 1. Prepare Production Environment

Create `.env.production.local` with your production values:

```bash
cp .env.production .env.production.local
```

Edit with your production Neon Cloud database URL:

```bash
# Production Neon Cloud Database
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/dbname?sslmode=require

# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secure-production-jwt-secret-here

# Optional: For monitoring and management
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_neon_project_id
```

### 2. Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml --env-file .env.production.local up --build -d
```

### 3. Alternative: Deploy with Environment Variables

For cloud platforms (AWS ECS, Google Cloud Run, etc.):

```bash
# Build the image
docker build -t acquisitions-api:latest .

# Run with environment variables
docker run -d \
  --name acquisitions-api-prod \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your-neon-cloud-url" \
  -e JWT_SECRET="your-jwt-secret" \
  acquisitions-api:latest
```

## Environment Configuration

### Development vs Production

| Environment     | Database            | Connection         | Branch Management                         |
| --------------- | ------------------- | ------------------ | ----------------------------------------- |
| **Development** | Neon Local (Docker) | `neon-local:5432`  | Ephemeral branches (auto-created/deleted) |
| **Production**  | Neon Cloud          | `ep-xxx.neon.tech` | Persistent production database            |

### Environment Variables

| Variable           | Development        | Production     | Description                   |
| ------------------ | ------------------ | -------------- | ----------------------------- |
| `NODE_ENV`         | `development`      | `production`   | Runtime environment           |
| `DATABASE_URL`     | Neon Local URL     | Neon Cloud URL | PostgreSQL connection string  |
| `JWT_SECRET`       | Dev secret         | Strong secret  | JWT signing key               |
| `NEON_API_KEY`     | Required for Local | Optional       | Neon API access               |
| `NEON_PROJECT_ID`  | Required for Local | Optional       | Your Neon project             |
| `PARENT_BRANCH_ID` | Required for Local | N/A            | Branch for ephemeral branches |

## API Endpoints

### Health & Status

- `GET /health` - Health check with uptime
- `GET /api` - API status

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Example: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

## Database Management

### Development (Neon Local)

```bash
# Generate new migration
docker exec -it acquisitions-api-dev npm run db:generate

# Apply migrations
docker exec -it acquisitions-api-dev npm run db:migrate

# Open Drizzle Studio (Database GUI)
docker exec -it acquisitions-api-dev npm run db:studio
```

### Production (Neon Cloud)

```bash
# Apply migrations
docker exec -it acquisitions-api-prod npm run db:migrate

# Check migration status
docker exec -it acquisitions-api-prod npm run db:studio
```

### Key Features

- **Ephemeral Development Branches**: Each `docker-compose up` creates a fresh database branch
- **Automatic Cleanup**: Development branches are deleted when containers stop
- **Type-Safe Operations**: Drizzle ORM provides full TypeScript support
- **Migration Management**: Version-controlled database schema changes

## Troubleshooting

### Common Issues

#### 1. Neon Local Connection Issues

```bash
# Check if Neon Local is running
docker logs neon-local-proxy

# Verify environment variables
docker exec -it neon-local-proxy env | grep NEON
```

#### 2. API Connection to Database

```bash
# Check API logs
docker logs acquisitions-api-dev

# Test database connectivity
docker exec -it acquisitions-api-dev npm run db:studio
```

#### 3. Port Conflicts

```bash
# Check what's using port 3000 or 5432
lsof -i :3000
lsof -i :5432

# Change ports in docker-compose.yml if needed
```

#### 4. Environment Variable Issues

```bash
# Verify environment variables are loaded
docker exec -it acquisitions-api-dev env | grep DATABASE_URL
docker exec -it acquisitions-api-dev env | grep NODE_ENV
```

### Docker Commands Reference

```bash
# View running containers
docker ps

# View logs
docker logs acquisitions-api-dev
docker logs neon-local-proxy

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Clean up unused resources
docker system prune -a
```

### Development Workflow

1. **Start Development**: `docker-compose -f docker-compose.dev.yml up --build`
2. **Make Code Changes**: Edit files in `src/`
3. **Database Changes**: Update models, run `db:generate`, then `db:migrate`
4. **Test API**: Use Postman, curl, or your frontend
5. **Check Logs**: `docker logs acquisitions-api-dev`
6. **Stop Environment**: `docker-compose -f docker-compose.dev.yml down`

---

## Security Notes

- **Development**: Uses Neon Local with ephemeral branches (secure for development)
- **Production**: Requires strong JWT secrets and secure Neon Cloud connections
- **Cookies**: HTTP-only, secure flags in production
- **Passwords**: Bcrypt hashing with 10 salt rounds
- **Input**: Zod validation on all inputs

For production deployment, ensure:

- Strong, unique JWT secrets
- Secure DATABASE_URL with SSL
- Regular security updates
- Monitoring and logging
- Backup strategies
