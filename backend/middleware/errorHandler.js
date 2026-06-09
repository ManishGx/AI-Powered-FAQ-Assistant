const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Resource not found." });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isServerError = statusCode >= 500;
  const responseBody = {
    message: isServerError ? "Internal server error." : err.message || "Bad request.",
  };

  if (process.env.NODE_ENV !== "production") {
    responseBody.detail = err.message;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
