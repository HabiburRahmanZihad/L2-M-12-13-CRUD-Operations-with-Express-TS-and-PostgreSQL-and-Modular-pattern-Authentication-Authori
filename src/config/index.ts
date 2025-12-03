import dotenv from "dotenv";
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env')
});

const config = {
  port: process.env.PORT || 8080,
  connectionString: process.env.CONNECTION_STRING || '',
  jwtSecret: process.env.JWT_SECRET,
};

export default config;