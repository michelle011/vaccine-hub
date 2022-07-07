// Imports
const { NotFoundError } = require("./utils/errors");
const authRoutes = require("./routes/auth");

// Libraries and packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// Handle 404 errors
app.use((res, req, next) => {
  return next(new NotFoundError());
});

/* Generic error handler - anything that is unhandled will be handled here */
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
