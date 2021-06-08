const { json } = require('body-parser');
const { MongoClient } = require('mongodb');
// Replace the uri string with your MongoDB deployment's connection string.
// 'mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net/flicksick_india?retryWrites=true&w=majority'
const uri = 'mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net?retryWrites=true&writeConcern=majority';

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
async function run() {
	try {
		await client.connect();
		const database = client.db('flicksick_india');
		const movies = database.collection('movies');
		// Query for a movie that has the title 'Back to the Future'
		// const query = { fs_id: 'tUdwXjQ7UlhO-fK8b6oIe' };
		const query = {};
		const movie = await movies.find(query).forEach((item) => {
			console.log(JSON.stringify(item));
		});
		// movie.forEach((item) => {
		// 	console.log(JSON.stringify(item));
		// });
		// movie.map((item) => {
		// 	console.log(JSON.stringify(item));
		// });
		// console.log(movie);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
