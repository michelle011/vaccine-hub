const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      email: user.email,
      date: user.date,
    };
  }

  static async login(credentials) {
    // Check required fields
    const requiredFields = ["email", "password"];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });
    // Check if the user trying to log in is an existing user
    const user = await User.fetchUserByEmail(credentials.email);
    // If the user does not exist, throw error
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    throw new UnauthorizedError("Invalid email/password combo");
  }

  static async register(credentials) {
    // Checks required fields
    const requiredFields = [
      "email",
      "password",
      "first_name",
      "last_name",
      "location",
      "date",
    ];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email");
    }
    // Make sure no user already exists with that email
    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }
    // Lowercase email, destructure variables, and HASH password
    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );
    const lowercasedEmail = credentials.email.toLowerCase();
    // Create new user
    const result = await db.query(
      `INSERT INTO users (
        email, 
        password, 
        first_name,
        last_name,
        location,
        date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, location, date;
    `,
      [
        lowercasedEmail,
        hashedPassword,
        credentials.first_name,
        credentials.last_name,
        credentials.location,
        credentials.date,
      ]
    );
    // Return the user
    const user = result.rows[0];
    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email.toLowerCase()]);
    const user = result.rows[0];
    return user;
  }
}

module.exports = User;
