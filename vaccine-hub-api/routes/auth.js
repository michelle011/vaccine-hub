const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const User = require("../models/user");

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body);
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    return res.status(201).json({ user }); // 201 status means 'created'
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// userRouter.routes("./register").post((req, res, next) => {
//   const userObj = req.body;
//   if (!userObj.email || userObj.pw) {
//     res.status(400).send("misisng required fields");
//   } else {
//     const userFromDB = getUser(userObj.email);
//     if (!userFromDB) {
//       const hashedPw = bcrypt.hashSync(userObj.pw, 10);
//       const savedUser = savedUser(userObj.email.hashedPw);
//       if (savedUser) {
//         res.status(201).send(savedUser);
//       }
//     } else {
//       res.status(400).send("user already exists");
//     }
//     // check user exists
//     // if they exist -> prompt to login
//     // if not, create user
//     // on create, hash pw
//   }
// });

// exports.getUser = async (email) => {
//   const res = await Client.query('Select * from "user" where email=$1', [
//     email,
//   ]);
//   return res.rows[0];
// };

// exports.savedUser = async (newUser, hashedPw) => {
//   const res = await Client.query('insert into "user" values ($1,$2)', [
//     newUser.email,
//     hashedPw,
//   ]);
//   return res.rows[0];
// };
