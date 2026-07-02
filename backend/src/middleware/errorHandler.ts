import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    res.status(409).json({ message: "Duplicate field value entered" });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    res.status(400).json({ message });
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({ message: "Invalid resource ID" });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};