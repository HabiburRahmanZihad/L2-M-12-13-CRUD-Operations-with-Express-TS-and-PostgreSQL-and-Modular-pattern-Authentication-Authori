import express, { Request, Response } from 'express'

import config from './config';
import initDb, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.route';

const app = express()
const port = config.port || 8080;


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

//create a todo
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error inserting todo into the database',
      error: error.message
    });
  }
});


// Get all todos
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.status(200).json({
      success: true,
      todos: result.rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos from the database',
      error: error.message
    });
  }
});


// Get a single todo by ID
app.get('/todos/:id', async (req: Request, res: Response) => {
  const todoId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [todoId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo from the database',
      error: error.message
    });
  }
});


// Update a todo by ID
app.put('/todos/:id', async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const { title, is_completed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos
        SET title = $1, is_completed = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [title, is_completed, todoId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo in the database',
      error: error.message
    });
  }
});


// Delete a todo by ID
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const todoId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [todoId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo from the database',
      error: error.message
    });
  }
});



//Handle Invalid Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
