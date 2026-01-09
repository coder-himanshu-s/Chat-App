// middlewares/error.middleware.js
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    console.error(err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      data: null,
    });
  }

  // Fallback for any unhandled error
  console.error(err);
  const response = {
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : (err.message || "Internal Server Error"),
    errors: [],
    data: null,
  };
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }
  return res.status(500).json(response);
};

export default errorHandler;
