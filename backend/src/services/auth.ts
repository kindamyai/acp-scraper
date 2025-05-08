import jwt from 'jsonwebtoken'; import User 
from '../models/User'; import config from 
'../config'; import { AppError } from 
'../middlewares/error';
// Generate JWT token
export const generateToken = (userId: 
string): string => {
  return jwt.sign({ id: userId }, 
  config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};
// Register a new user
export const registerUser = async (username: 
string, email: string, password: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ 
  $or: [{ email }, { username }] }); if 
  (existingUser) {
    if (existingUser.email === email) { throw 
      new AppError('Email already in use', 
      400);
    } else {
      throw new AppError('Username already 
      taken', 400);
    }
  }
  
  // Create new user
  const user = await User.create({ username, 
    email, password,
  });
  
  return { _id: user._id, username: 
    user.username, email: user.email,
  };
};
// Login user
export const loginUser = async (email: 
string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email }); 
  if (!user) {
    throw new AppError('Invalid email or 
    password', 401);
  }
  
  // Check password
  const isMatch = await 
  user.comparePassword(password); if 
  (!isMatch) {
    throw new AppError('Invalid email or 
    password', 401);
  }
  
  return { _id: user._id, username: 
    user.username, email: user.email,
  };
};
