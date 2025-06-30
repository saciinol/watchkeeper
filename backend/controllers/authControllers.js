import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const registerAuth = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const saltRounds = process.env.NODE_ENV === "development" ? 4 : 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);

		const newRegisteredUser = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${hash})
      RETURNING *
    `;

		console.log("New user added:", newRegisteredUser[0]);

		// exclude password_hash from response
		const user = { ...newRegisteredUser[0] };
		delete user.password_hash;

		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error("Registration error:", error);

		// handle specific database errors
		if (error.code === "23505") {
			// postgreSQL unique constraint violation
			return res.status(409).json({
				success: false,
				message: "Email already in use",
			});
		}

		res.status(500).json({
			success: false,
			message: "Registration failed",
			...(process.env.NODE_ENV === "development" && { error: error.message }),
		});
	}
};

export const loginAuth = async (req, res) => {
	const { email, password } = req.body;

	try {
		// find user by email
		const existingUser = await sql`
			SELECT * FROM users WHERE email = ${email}
		`;

		if (existingUser.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const user = existingUser[0];

		// Compare password
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN || "24h",
			}
		);

		// remove password_hash from response
		const userResponse = { ...user };
		delete userResponse.password_hash;

		res.status(200).json({
			success: true,
			data: {
				user: userResponse,
				token,
			},
		});
	} catch (error) {
		console.error("Login error:", error);

		res.status(500).json({
			success: false,
			message: "Login failed",
			...(process.env.NODE_ENV === "development" && { error: error.message }),
		});
	}
};
