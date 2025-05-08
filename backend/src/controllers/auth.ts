import { Request, Response, NextFunction } 
from 'express'; import { registerUser, 
loginUser, generateToken } from 
'../services/auth'; import logger from 
'../config/logger'; import { AppError } from 
'../middlewares/error';
// Register a new user
export const register = async (req: Request, 
res: Response, next: NextFunction) => {
  try { const { username, email, password } = 
    req.body;
    
    // Validate input
    if (!username || !email || !password) { 
      throw new AppError('Please provide 
      username, email and password', 400);
    }
    
    // Register user
    const user = await registerUser(username, 
    email, password);
    
    // Generate token
    const token = 
    generateToken(user._id.toString());
    
    // Set cookie if in production
    if (process.env.NODE_ENV === 
    'production') {
      res.cookie('token', token, { httpOnly: 
        true, secure: true, maxAge: 7 * 24 * 
        60 * 60 * 1000, // 7 days
      });
    }
    
    res.status(201).json({ user: { id: 
        user._id, username: user.username, 
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
// Login user
export const login = async (req: Request, 
res: Response, next: NextFunction) => {
  try { const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) { throw new 
      AppError('Please provide email and 
      password', 400);
    }
    
    // Login user
    const user = await loginUser(email, 
    password);
    
    // Generate token
    const token = 
    generateToken(user._id.toString());
    
    // Set cookie if in production
    if (process.env.NODE_ENV === 
    'production') {
      res.cookie('token', token, { httpOnly: 
        true, secure: true, maxAge: 7 * 24 * 
        60 * 60 * 1000, // 7 days
      });
    }
    
    res.status(200).json({ user: { id: 
        user._id, username: user.username, 
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
// Get current user
export const getCurrentUser = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try {
    // User should be attached by the 
    // authenticate middleware
    if (!req.user) { throw new AppError('Not 
      authenticated', 401);
    }
    
    res.status(200).json({ id: req.user._id, 
      username: req.user.username, email: 
      req.user.email,
    });
  } catch (error) {
    next(error);
  }
};
// Logout user
export const logout = (req: Request, res: 
Response) => {
  // Clear cookie if in production
  if (process.env.NODE_ENV === 'production') 
  {
    res.clearCookie('token');
  }
  
  res.status(200).json({ message: 'Logged out 
  successfully' });
};
