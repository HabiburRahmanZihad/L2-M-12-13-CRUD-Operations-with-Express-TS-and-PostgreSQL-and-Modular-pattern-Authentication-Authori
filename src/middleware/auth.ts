import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express'
import config from '../config';

//auth middleware
const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'];
      console.log(token);
      // return next();
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const decoded = jwt.verify(token, config.jwtSecret as string);
      console.log({ decoded });
      req.user = decoded as jwt.JwtPayload | string;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

export default auth;