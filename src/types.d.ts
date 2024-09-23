import { Request } from 'express';
import { User } from './models/user.model';

// Extend the Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User; // or specify the type of 'user' (e.g., User type from your app)  
    }
  }
}
