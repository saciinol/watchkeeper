import { sql } from "../config/db.js";

const SAMPLE_MOVIES = [
	{
		tmdb_id: 299534,
		title: "Avengers: Endgame",
		year: 2019,
		poster_url: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
		plot: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
	},
	{
		tmdb_id: 105864,
		title: "The Wolf of Wall Street",
		year: 2013,
		poster_url: "https://image.tmdb.org/t/p/w500/pWHf4khOloNVfCxscsXFj3jj6gP.jpg",
		plot: "A New York stockbroker rises to immense wealth and power, indulging in a life of excess. But his empire unravels as his shady dealings attract the attention of law enforcement.",
	},
	{
		tmdb_id: 603692,
		title: "John Wick: Chapter 4",
		year: 2023,
		poster_url: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
		plot: "With the price on his head ever increasing, legendary hit man John Wick takes his fight against the High Table global as he seeks out the most powerful players in the underworld.",
	},
	{
		tmdb_id: 569094,
		title: "Spider-Man: Across the Spider-Verse",
		year: 2023,
		poster_url: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
		plot: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
	},
	{
		tmdb_id: 335983,
		title: "Venom",
		year: 2018,
		poster_url: "https://image.tmdb.org/t/p/w500/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",
		plot: "Journalist Eddie Brock is trying to take down Carlton Drake, the notorious and brilliant founder of the Life Foundation. While investigating one of Drake's experiments, Eddie's body merges with the alien Venom—leaving him with superhuman strength and power.",
	},
	{
		tmdb_id: 9502,
		title: "Ice Age",
		year: 2002,
		poster_url: "https://image.tmdb.org/t/p/w500/gLhHHZUzeseRXShoDyC4VqLgsNv.jpg",
		plot: "With the impending ice age almost upon them, a mismatched trio of prehistoric critters—Manny the mammoth, Sid the sloth, and Diego the saber-toothed tiger—embark on an epic journey to return a human baby to its tribe.",
	},
	{
		tmdb_id: 118340,
		title: "Guardians of the Galaxy",
		year: 2014,
		poster_url: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
		plot: "Brash space adventurer Peter Quill becomes the quarry of relentless bounty hunters after he steals an orb coveted by a powerful villain. To save the universe, he must team up with a ragtag band of misfits.",
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
