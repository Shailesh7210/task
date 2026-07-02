import { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps async route handlers so thrown errors/rejected promises
// are forwarded to Express's error-handling middleware automatically.
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};