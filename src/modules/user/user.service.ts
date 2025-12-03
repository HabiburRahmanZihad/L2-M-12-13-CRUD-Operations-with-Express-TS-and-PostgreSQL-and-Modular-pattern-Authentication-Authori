import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
// Create a new user
const CreateUser = async (payload: Record<string, any>) => {
  const { name, role,email, password } = payload;



  const hashedpass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, role, email, hashedpass]
  );
  return result;
}

// Get all users
const GetAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result;
}

// Get a single user by ID
const GetUserById = async (userId: any) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result;
}

//Update a user by ID
const UpdateUserById = async (userId: any, name: string, email: string) => {
  const result = await pool.query(
      `UPDATE users
        SET name = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [name, email, userId]
    );
  return result;
}

// Delete a user by ID
const DeleteUserById = async (userId: any) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [userId]
  );
  return result;
}

export const userService = {
  CreateUser,
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById
};