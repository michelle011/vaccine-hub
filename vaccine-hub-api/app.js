const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

// const storeRouter = require("./routes/store");
const { BadRequestError, NotFoundError } = require("./utils/errors");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
// app.use(bodyParser.json());

// Handle 404 errors
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/* Generic error handler - anything that is unhandled will be handled here */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({ error: { message, status } });
});

module.exports = app;
