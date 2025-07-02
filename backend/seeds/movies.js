import { sql } from "../config/db.js";

const SAMPLE_MOVIES = [
	{
		tmdb_id: 157336,
		title: "Interstellar",
		year: 2014,
		poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
		plot: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
	},
	{
		tmdb_id: 372058,
		title: "Your Name.",
		year: 2016,
		poster_url: "https://image.tmdb.org/t/p/w500/8GJsy7w7frGquw1cy9jasOGNNI1.jpg",
		plot: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki’s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.",
	},
	{
		tmdb_id: 13,
		title: "Forrest Gump",
		year: 1994,
		poster_url: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
		plot: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
	},
	{
		tmdb_id: 496243,
		title: "Parasite",
		year: 2019,
		poster_url: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
		plot: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
	},
	{
		tmdb_id: 155,
		title: "The Dark Knight",
		year: 2008,
		poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
		plot: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
	},
	{
		tmdb_id: 129,
		title: "Spirited Away",
		year: 2001,
		poster_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
		plot: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
	},
	{
		tmdb_id: 238,
		title: "The Godfather",
		year: 1972,
		poster_url: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
		plot: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
	},
	{
		tmdb_id: 278,
		title: "The Shawshank Redemption",
		year: 1994,
		poster_url: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
		plot: "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
	},
];

async function seedDatabase() {
	try {
		// first, clear existing data
		// await sql`TRUNCATE TABLE products RESTART IDENTITY`;

		// insert all movies
		for (const movie of SAMPLE_MOVIES) {
			await sql`
        INSERT INTO movies (tmdb_id, title, year, poster_url, plot)
        VALUES (
          ${movie.tmdb_id},
          ${movie.title},
          ${movie.year},
          ${movie.poster_url},
          ${movie.plot}
        )
      `;
		}

		console.log("Database seeded successfully");
		process.exit(0); // success code
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1); // failure code
	}
}

seedDatabase();
