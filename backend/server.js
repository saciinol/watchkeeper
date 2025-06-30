import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
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

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews", reviewRoutes);

async function initDB() {
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

		await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

		// Use sql.query() for the trigger
		await sql.query(`
      CREATE OR REPLACE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

		await sql`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        tmdb_id INT UNIQUE,
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
        comment TEXT,
        UNIQUE (user_id, movie_id)
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
