# AyurSutra - Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 16+ installed
- MongoDB installed locally OR Docker installed
- Git installed

### Option 1: Local Development Setup

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd ayursutra-panchakarma-mvp
```

2. **Install dependencies:**
```bash
npm run install-deps
```

3. **Setup environment variables:**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configurations
```

4. **Start MongoDB locally** (if not using Docker)

5. **Run the development servers:**
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000
- MongoDB on localhost:27017

### Option 2: Docker Setup (Recommended)

1. **Clone the project:**
```bash
git clone <repository-url>
cd ayursutra-panchakarma-mvp
```

2. **Start all services with Docker:**
```bash
docker-compose up -d
```

This will automatically:
- Set up MongoDB with initial data
- Build and start the backend API
- Build and start the frontend app
- Handle all networking between services

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Production Deployment

### Environment Setup

1. **Set production environment variables:**
```bash
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-super-secure-secret-key
EMAIL_HOST=your-smtp-host
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-password
```

2. **Build the frontend:**
```bash
cd frontend
npm run build
```

### Deployment Options

#### Option 1: Cloud Platform (Heroku, Railway, etc.)
- Connect your Git repository
- Set environment variables in platform dashboard
- Deploy automatically on push to main branch

#### Option 2: VPS/Server Deployment
```bash
# Install dependencies
npm run install-deps

# Build frontend
cd frontend && npm run build && cd ..

# Start with PM2 (recommended)
npm install -g pm2
pm2 start backend/server.js --name ayursutra-api
pm2 startup
pm2 save

# Or start directly
cd backend && npm start
```

#### Option 3: Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## Database Setup

### Initial Data Seeding

1. **Create sample therapies:**
```bash
cd backend
node scripts/seed-therapies.js
```

2. **Create admin user:**
```bash
node scripts/create-admin.js
```

### Backup and Restore

```bash
# Backup
mongodump --uri="your-mongodb-uri" --out=backup/

# Restore  
mongorestore --uri="your-mongodb-uri" backup/
```

## Monitoring and Maintenance

### Health Checks
- Backend health: GET http://localhost:5000/health
- Database connectivity: Included in health check
- API status: Returns server status and uptime

### Logs
```bash
# View application logs
pm2 logs ayursutra-api

# View database logs
docker logs ayursutra-mongodb
```

### Performance Monitoring
- Enable MongoDB profiler for slow queries
- Use PM2 monitoring for Node.js performance
- Set up uptime monitoring for production

## Security Checklist

### Production Security
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

### Environment Variables
Never commit these to version control:
- `JWT_SECRET`
- `MONGODB_URI` (with credentials)
- `EMAIL_PASS`
- Any API keys or tokens

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

2. **Port Already in Use:**
   - Kill process: `lsof -ti:5000 | xargs kill -9`
   - Change port in environment variables

3. **Frontend Build Errors:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **API CORS Errors:**
   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in server.js

### Getting Help

1. Check the logs first
2. Verify environment variables are set correctly  
3. Ensure all dependencies are installed
4. Check if all services are running

## Development Workflow

### Making Changes

1. **Backend changes:**
   - Code is in `backend/` directory
   - Server auto-restarts with nodemon
   - Test API endpoints with Postman or curl

2. **Frontend changes:**
   - Code is in `frontend/src/` directory  
   - Hot reload enabled for development
   - Build production version with `npm run build`

3. **Database changes:**
   - Update models in `backend/models/`
   - Create migration scripts if needed
   - Test with sample data

### Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests  
cd frontend && npm test

# Run all tests
npm test
```

---

*For additional support, refer to the technical documentation in the `/docs` directory.*
