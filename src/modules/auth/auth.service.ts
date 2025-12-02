import bcrypt from "bcryptjs";
import { pool } from "../../config/db"
import jwt from "jsonwebtoken";

const loginUser = async (email: string, password: string) => {
  // Placeholder logic for user login

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error('User not found');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid password');
  }


  const secret = 'your_jwt_secret_key'
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "1h" }); // Replace with actual JWT generation logic
  return { user, token };
}

export const authService = {
  loginUser
};