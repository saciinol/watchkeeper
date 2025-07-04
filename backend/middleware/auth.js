import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

// Validate JWT_SECRET at module load time
if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not defined");
}

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access token required",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// verify user still exists in database
		const user = await sql`
			SELECT id, name, email FROM users WHERE id = ${decoded.userId}
		`;

		if (user.length === 0) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		// add user info to request object
		req.user = {
			id: decoded.userId,
			email: decoded.email,
			...user[0],
		};

		next();
	} catch (error) {
		console.error("Token verification error:", error);

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				success: false,
				message: "Token expired",
			});
		}

		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				success: false,
				message: "Invalid token",
			});
		}

		return res.status(403).json({
			success: false,
			message: "Token verification failed",
		});
	}
};

// optional middleware - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		req.user = null;
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await sql`
			SELECT id, name, email FROM users WHERE id = ${decoded.userId}
		`;

		if (user.length > 0) {
			req.user = {
				id: decoded.userId,
				email: decoded.email,
				...user[0],
			};
		} else {
			req.user = null;
		}
	} catch (error) {
		req.user = null;
	}

	next();
};