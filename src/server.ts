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
    return;
  }




  // console.log(req.body);

  res.status(201).json({
    success: true,
    message: 'Data received successfully'
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
