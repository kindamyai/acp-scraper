import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 internal server error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined = undefined;

  // If it's an AppError, use its status code and message
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  // Log the error
  logger.error(message, {
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack
  });

  // Send the response
  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined
  });
};

export { AppError };
export default errorHandler;
