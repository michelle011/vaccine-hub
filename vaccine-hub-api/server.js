const app = require("./app");
const { PORT } = require("./config");

// app.use((req, res, next) => {
//   return next(new NotFoundError());
// });

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message;

//   return res.status(status).json({
//     error: { message, status },
//   });
// });

// const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});
