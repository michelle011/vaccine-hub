const express = require("express");
// const { PORT } = require("./config.js");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const authRouter = require("./routes/auth");

const { BadRequestError, NotFoundError } = require("./utils/errors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// app.use("/auth", authRouter);

app.use((req, res, next) => {
  return next(new NotFoundError());
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
