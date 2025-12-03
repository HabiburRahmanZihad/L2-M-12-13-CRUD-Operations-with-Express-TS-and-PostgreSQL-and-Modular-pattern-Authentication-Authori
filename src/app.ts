import express, { Request, Response } from 'express'

import initDb from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.route';
import { todoRoutes } from './modules/todo/todo.route';
import { authRoutes } from './modules/auth/auth.routes';

const app = express()


// Middleware to parse JSON bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Initialize the database and create tables if they don't exist
initDb();

// Root Endpoint
app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next Level Programmers!')
})


//User CRUD Operations
app.use('/users', userRoutes);

// Todo CRUD Operations
app.use('/todos', todoRoutes);

// Authentication Routes
app.use('/auth', authRoutes);

//Handle Invalid Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


export default app;