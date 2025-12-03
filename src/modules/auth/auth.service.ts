import bcrypt from "bcryptjs";
import { pool } from "../../config/db"
import jwt from "jsonwebtoken";
import config from "../../config";

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

  const secret = config.jwtSecret as string;
  const token = jwt.sign({ userId: user.id,role: user.role, email: user.email  }, secret, { expiresIn: "1h" });
  return { user, token };
}

export const authService = {
  loginUser
};