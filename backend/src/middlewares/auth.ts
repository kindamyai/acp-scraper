import { Request, Response, NextFunction } 
from 'express'; import jwt from 
'jsonwebtoken'; import config from 
'../config'; import { AppError } from 
'./error'; import User from '../models/User';
// Extend Express Request type to include 
// user property
declare global { namespace Express { 
    interface Request {
      user?: any;
    }
  }
}
// Middleware to authenticate users
export const authenticate = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try {
    // Get token from Authorization header or 
    // cookies
    let token = '';
    
    if (req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')) 
    {
      token = 
      req.headers.authorization.split(' 
      ')[1];
    } else if (req.cookies && 
    } req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) { throw new 
      AppError('Authentication required', 
      401);
    }
    
    // Verify token
    const decoded = jwt.verify(token, 
    config.jwtSecret) as { id: string };
    
    // Find user by ID
    const user = await 
    User.findById(decoded.id).select('-password');
    
    if (!user) { throw new AppError('User not 
      found', 401);
    }
    
    // Add user to request object
    req.user = user; next();
  } catch (error) {
    next(new AppError('Authentication 
    failed', 401));
  }
};
// Optional authentication - doesn't throw 
// error if no token
export const authenticateOptional = async 
(req: Request, res: Response, next: 
NextFunction) => {
  try {
    // Get token from Authorization header or 
    // cookies
    let token = '';
    
    if (req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')) 
    {
      token = 
      req.headers.authorization.split(' 
      ')[1];
    } else if (req.cookies && 
    } req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) { return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, 
    config.jwtSecret) as { id: string };
    
    // Find user by ID
    const user = await 
    User.findById(decoded.id).select('-password');
    
    if (user) {
      // Add user to request object
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Just continue if authentication fails
    next();
  }
};
