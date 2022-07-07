const db = require("../db");
const bcrypt = require("bcryptjs");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async login(credentials) {
    // Check required fields
    const requiredFields = ["email", "password"];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    // Check if the user trying to log in is an existing user
    const user = await User.fetchUserByEmail(credentials.email);
    // If the user does not exist, throw error
    if (!user) {
      throw new BadRequestError("Email/User does not exist");
    }

    // If the user does exist, check if password is valid
    const isValid = await bcrypt.compare(credentials.password, user.password);

    if (isValid) {
      return user;
    }

    throw new UnauthorizedError("Invalid email/password combo");
  }

  static async register(credentials) {
    // Checks required fields
    const requiredFields = [
      "email",
      "password",
      "firstName",
      "lastName",
      "location",
      "date",
    ];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid Email");
    }

    // Make sure no user already exists with that email
    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }

    // Lowercase email, destructure variables, and HASH password
    const lowercasedEmail = credentials.email.toLowerCase();
    const firstName = credentials.firstName;
    const lastName = credentials.lastName;
    const location = credentials.location;
    const date = credentials.date;
    // Hash Passowrd
    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );

    // Create new user
    const results = await db.query(
      `
        INSERT INTO users (
            password,
            firstName,
            lastName,
            email,
            location,
            date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, password, firstName, lastName, date;
        `,
      [hashedPassword, firstName, lastName, lowercasedEmail, location, date]
    );

    // Return the user
    const user = results.rows[0];

    return user;
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }

    const query = "SELECT * FROM users WHERE email = $1";

    const result = await db.query(query, [email.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
