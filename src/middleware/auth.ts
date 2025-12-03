import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express'
import config from '../config';

//auth middleware
const auth = (...roles: string[]) => {
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

      if (roles.length && !roles.includes((decoded as any).role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

export default auth;