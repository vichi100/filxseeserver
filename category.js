var axios = require('axios').default;
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

const Util = require('./models/util');
const Movie = require('./models/movie');

const category = [
	{
		title: 'romcom',
		query: {
			'genres.name': { $all: [ 'Romance', 'Comedy' ] },
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},

	{
		title: 'sitcom',
		query: {
			'genres.name': { $in: [ 'Comedy' ] },
			media_type: 'series',
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'biographies',
		query: {
			'genres.name': { $in: [ 'Biography' ] },
			media_type: 'series',
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'happy_ending',
		query: {
			$and: [
				{ 'genres.name': { $nin: [ 'Romance' ] } },
				{
					'genres.name': { $all: [ 'Comedy', 'Drama' ] },

					release_date: { $gte: 1990 },
					imdb_rating: { $gte: 6.5 }
				}
			]
		}
	},
	{
		title: 'sport',
		query: {
			$or: [
				{ 'genres.name': { $all: [ 'Sport', 'History', 'Biography' ] } },
				{ 'genres.name': { $all: [ 'Sport', 'History' ] } },
				{ 'genres.name': { $all: [ 'Sport', 'Biography' ] } }
			],
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'animation',
		query: {
			'genres.name': 'Animation',
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'murder_mystery',
		query: {
			$or: [ { overview: /murder/ }, { overview: /mystery/ }, { overview: /killed/ } ],
			'genres.name': { $in: [ 'Crime' ] },
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'serial_killer',
		query: {
			$or: [ { overview: /serial/ }, { overview: /killer/ }, { overview: /murders/ }, { overview: /killings/ } ],
			'genres.name': { $in: [ 'Crime' ] },
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'mafia',
		query: {
			$or: [
				{ overview: /gangster/ },
				{ overview: /gang/ },
				{ overview: /mafia/ },
				{ overview: /drug lord/ },
				{ overview: /organized crime/ }
			],
			'genres.name': { $in: [ 'Crime' ] },
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},

	{
		title: 'horror',
		query: {
			'genres.name': 'Horror',
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'zombi',
		query: {
			overview: /zombi/,
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'spy',
		query: {
			$or: [
				{ overview: /CIA/ },
				{ overview: /KGB/ },
				{ overview: /mi6/ },
				{ overview: /spy/ },
				{ overview: /mossad/ },
				{ overview: /james bond/ },
				{ overview: /007/ },
				{ overview: /Secret Service/ },
				{ overview: /agent/ }
			],
			'genres.name': { $in: [ 'Action' ] },
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'war',
		query: {
			'genres.name': 'War',
			release_date: { $gte: 1990 },
			imdb_rating: { $gte: 6.5 }
		}
	},
	{
		title: 'space_aliens',
		query: {
			$and: [
				{ 'genres.name': { $nin: [ 'Animation' ] } },
				{
					$or: [
						{ overview: /planet/ },
						{ overview: /space/ },
						{ overview: /universe/ },
						{ overview: /explorers/ },
						{ overview: /Astronaut/ },
						{ overview: /Shuttle/ },
						{ overview: /alien/ },
						{ overview: /galaxy/ },
						{ overview: /spacecraft/ },
						{ overview: /NASA/ },
						{ overview: /asteroid/ }
					],
					'genres.name': { $in: [ 'Adventure' ] },
					release_date: { $gte: 1990 },
					imdb_rating: { $gte: 6.5 }
				}
			]
		}
	},

	{
		title: 'scifi',
		query: {
			$and: [
				{ 'genres.name': { $nin: [ 'Animation' ] } },
				{
					$nor: [
						{ overview: /planet/ },
						{ overview: /space/ },
						{ overview: /universe/ },
						{ overview: /explorers/ },
						{ overview: /Astronaut/ },
						{ overview: /Shuttle/ },
						{ overview: /alien/ },
						{ overview: /galaxy/ },
						{ overview: /spacecraft/ },
						{ overview: /NASA/ },
						{ overview: /asteroid/ }
					],
					'genres.name': { $in: [ 'Science Fiction' ] },
					release_date: { $gte: 1990 },
					imdb_rating: { $gte: 6.5 }
				}
			]
		}
	}
];

const categoryMapping = [
	{
		category: 'RomCom',
		document: 'romcoms'
	},
	{
		category: 'SitCom',
		document: 'sitcoms'
	},
	{
		category: 'Biography',
		document: 'biographies'
	},
	{
		category: 'Happy Ending',
		document: 'happy_endings'
	},
	{
		category: 'Sport',
		document: 'sports'
	},

	{
		category: 'Animation',
		document: 'animations'
	},
	{
		category: 'Murder Mystery',
		document: 'murder_mysteries'
	},
	{
		category: 'Serial Killer',
		document: 'serial_killers'
	},
	{
		category: 'Mafia',
		document: 'mafias'
	},
	{
		category: 'Horror',
		document: 'horrors'
	},
	{
		category: 'Zombi',
		document: 'zombis'
	},
	{
		category: 'Spy',
		document: 'spies'
	},
	{
		category: 'War',
		document: 'wars'
	},
	{
		category: 'Space & Aliens',
		document: 'space_aliens'
	},
	{
		category: 'SciFi',
		document: 'scifis'
	}
];

mongoose
	// .connect('mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net/flicksick_india?retryWrites=true&w=majority')
	.connect('mongodb://flicksick:flicksick123@209.145.57.26:27017/flicksick_india')
	.then(() => {
		console.log('MongoDB connected...server listening at 3000');
	})
	.catch((err) => console.log(err));

category.map((item) => {
	const query = item.query;
	// console.log("category: ", item.title)
	Movie.find(query)
		.sort({
			imdb_rating: -1
		})
		.limit(100)
		.then((result) => {
			console.log(item.title, JSON.stringify(result.length));
			// var Test = mongoose.model(item.title, new Schema(), item.title);

			var thingSchema = new Schema({}, { strict: false });
			var Thing = mongoose.model(item.title, thingSchema);
			// var thing = new Thing(result);
			Thing.collection.insertMany(result); // iAmNotInTheSchema is now saved to the db!!
		})
		.catch((err) => {
			console.log(err);
		});
});

// Util.collection.updateMany({ _id: ObjectId('60b25af0ce6e65463c414d66'), { $set: { category: categoryMapping } });

// Util.collection
// 	.updateOne(
// 		{ _id: ObjectId('60b25af0ce6e65463c414d66') },
// 		{
// 			$set: { category: categoryMapping }
// 		}
// 	)
// 	.then((result) => {
// 		console.log('success');
// 	});
