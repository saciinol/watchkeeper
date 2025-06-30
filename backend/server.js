import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(morgan("dev")); // log the requests

app.get("/", (req, res) => {
	res.send("Hello from the backend");
});

async function initDB() {
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `;

		await sql`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        year INT,
        poster_url TEXT,
        plot TEXT
      );
    `;

		await sql`
      CREATE TABLE IF NOT EXISTS watchlists (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        status VARCHAR(50),
        UNIQUE (user_id, movie_id)
      );
    `;

		await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        rating INT,
        comment TEXT
      );
    `;

		console.log("Database initialized successfully");
	} catch (error) {
		console.log("Error initDB", error);
	}
}

initDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server is running on port " + PORT);
	});
});