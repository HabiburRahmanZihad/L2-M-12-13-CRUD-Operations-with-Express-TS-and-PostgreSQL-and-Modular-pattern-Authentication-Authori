import { Request, Response, Router } from "express";
import { pool } from "../../config/db";

const router = Router();

// Create a new user
router.post("/", async (req: Request, res: Response) => {
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

// Get all users
router.get('/', async (req: Request, res: Response) => {
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
router.get('/:id', async (req: Request, res: Response) => {
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


//Update a user by ID
router.put('/:id', async (req: Request, res: Response) => {
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
})


// Delete a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
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
})

export const userRoutes = router;