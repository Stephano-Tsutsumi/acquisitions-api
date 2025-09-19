import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import securityMiddleware from './middleware/security.middleware.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());

// Error handling middleware for JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    logger.error('JSON parsing error:', error.message);
    return res.status(400).json({ 
      error: 'Invalid JSON format',
      message: 'Please check your request body format'
    });
  }
  next(error);
});

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) }}));

app.use(securityMiddleware)

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions!');

  res.status(200).send('Hello from Acquisitions!'); 
});

// Health check // Uptime checks how long the server has been up
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime()});
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running! '});
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

export default app;