import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import { corsOptions, securityMiddleware } from './middlewares/security.js';
import { sanitizeInput } from './middlewares/sanitize.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler, notFound } from './middlewares/error.js';

export const app = express();

app.use(corsOptions);
app.use(securityMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);
