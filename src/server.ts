import express, { Request, Response } from 'express'
import { Pool } from "pg";
import dotenv from "dotenv";
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env')
});

const app = express()
const port = 8080
// Middleware to parse JSON bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// PostgreSQL connection setup - NeonDB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);


  console.log("Database initialized and 'users' table created (if not exists).");


  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT FALSE,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDb();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Level Programmers!')
})


//User CRUD Operations

// Read all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json({
      success: true,
      users: result.rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users from the database',
      error: error.message
    });
  }
});


// Get a single user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user from the database',
      error: error.message
    });
  }
});


// Create a new user
app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error inserting data into the database',
      error: error.message
    });
  }

  // console.log(req.body);
})


//Update a user by ID
app.put('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
        SET name = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [name, email, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user in the database',
      error: error.message
    });
  }
});


// Delete a user by ID
app.delete('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user from the database',
      error: error.message
    });
  }
});



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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
