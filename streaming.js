var axios = require('axios').default;
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Movie = require('./models/movie');
const genresX = {
	'1': 'Biography',
	'2': 'Film Noir',
	'3': 'Game Show',
	'4': 'Musical',
	'5': 'Sport',
	'6': 'Short',
	'7': 'Adult',
	'12': 'Adventure',
	'14': 'Fantasy',
	'16': 'Animation',
	'18': 'Drama',
	'27': 'Horror',
	'28': 'Action',
	'35': 'Comedy',
	'36': 'History',
	'37': 'Western',
	'53': 'Thriller',
	'80': 'Crime',
	'99': 'Documentary',
	'878': 'Science Fiction',
	'9648': 'Mystery',
	'10402': 'Music',
	'10749': 'Romance',
	'10751': 'Family',
	'10752': 'War',
	'10763': 'News',
	'10764': 'Reality',
	'10767': 'Talk Show'
};
// mongodb+srv://vichi:<password>@cluster0.emt5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose
	.connect('mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net/flicksick_india?retryWrites=true&w=majority')
	.then(() => {
		console.log('MongoDB connected...server listening at 3000');
	})
	.catch((err) => console.log(err));

const sleep = (milliseconds) => {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
};

const insertData = (page) => {
	console.log('insertData page: ', page);
	var options = {
		method: 'GET',
		url: 'https://streaming-availability.p.rapidapi.com/search/ultra',
		params: {
			country: 'in',
			services: 'prime,netflix',
			type: 'movie',
			order_by: 'year',
			page: page,
			desc: 'true'
		},
		headers: {
			'x-rapidapi-key': '03fe41fbaamsh36e3caed36bbea5p18c791jsndbf3b6fe4482',
			'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
		}
	};
	sleep(1000);
	axios
		.request(options)
		.then(function(response) {
			console.log(response.data);
			sleep(1000);
			response.data.results.map((item) => {
				const genresArray = item.genres;
				const genresObjArray = [];
				genresArray.map((item) => {
					const nameTemp = genresX[item.toString()];
					const genresObj = {
						id: item,
						name: nameTemp
					};
					genresObjArray.push(genresObj);
				});

				console.log('genresObjArray: ', genresObjArray);

				obj = {
					fs_id: nanoid().toString(),
					tmdb_id: item.tmdbID,
					tmdb_rating: item.tmdbRating,
					tmdb_vote_count: null,
					age: item.age,
					adult: false,
					backdrop_path: item.backdropPath,
					backdrop_urls: item.backdropURLs,
					belongs_to_collection: null,
					budget: null,
					genres: genresObjArray,
					homepage: null,
					imdb_id: item.imdbID,
					imdb_rating: item.imdbRating,
					imdb_vote_count: item.imdbVoteCount,
					rotten_tomatoes_rating: null,
					streaming_info: item.streamingInfo,
					original_language: item.originalLanguage,
					original_title: item.originalTitle,
					overview: item.overview,
					poster_urls: item.posterURLs,
					poster_path: item.posterPath,
					release_date: item.year,
					revenue: null,
					runtime: item.runtime,
					spoken_languages: [ item.originalLanguage ],
					status: null,
					tagline: item.tagline,
					title: item.title,
					trailer: item.video,
					cast: item.cast,
					category: null, // like rom-com, sitcom etc
					media_type: 'movie', // movie, series ################# CHANGE THIS TO SERIES WHEN TYPE IS SERIES ########
					fs_rating: {
						loved_it: 0,
						dumb_but_entertaining: 0,
						just_time_pass: 0,
						worthless: 0,
						total_votes: 0
					}
				};
				Movie.collection
					.insertOne(obj)
					.then((result) => {
						console.log(result);
					})
					.catch((err) => {
						console.error(`getUserDetails# Failed to insert documents : ${err}`);
					});
			});
		})
		.catch(function(error) {
			console.error(error);
		});
};

sleep(10000);
for (i = 1; i < 233; i++) {
	insertData(i);
	console.log('page: ', i);
	sleep(1000);
}
// https://www.hotstar.com/in/movies/20000%20Leagues%20Under%20the%20Sea/4SAB7qEx02M1
// https://www.hotstar.com/in/movies/20000-Leagues-Under-the-Sea/4SAB7qEx02M1

// var str =
// 	'{Ready Player One, budget: 175000000, vote_average: 7.6, runtime: 140000} {poster_path: /zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg,';

// x = str.replaceAll('} {poster_path:', '} , {poster_path:');
// console.log(x);

// // function indexes(source, find) {
// // 	if (!source) {
// // 		return [];
// // 	}
// // 	if (!find) {
// // 		return source.split('').map(function(_, i) {
// // 			return i;
// // 		});
// // 	}
// // 	source = source.toLowerCase();
// // 	find = find.toLowerCase();
// // 	var result = [];
// // 	var i = 0;
// // 	while (i < source.length) {
// // 		if (source.substring(i, i + find.length) == find) result.push(i++);
// // 		else i++;
// // 	}
// // 	return result;
// // }

// // function replaceBetween(origin, startIndex, endIndex, insertion) {
// // 	return origin.substring(0, startIndex) + insertion + origin.substring(endIndex);
// // }

// // var str =
// // 	'{7.6, runtime: 140000} {poster_path: /zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg,{Ready Player One, budget: 175000000, vote_average: 7.6, runtime: 140000} {poster_path: /zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg,';

// // // console.log(indexes(str, '} {poster_path'));

// // var tempArray = indexes(str, '} {poster_path');
// // console.log(tempArray);
// // // var y = replaceBetween(str, 20, 22, '} , {');
// // // console.log(y);

// // for (var i = 0; i < tempArray.length; i++) {
// // 	num = tempArray[i];
// // 	str = replaceBetween(str, num - 1, num + 1, '},{');
// // 	console.log(str.replaceAll('} {poster_path, ''));
// // 	// tempArray = indexes(str, '} {poster_path');
// // 	// Do something with element
// // }
// // // console.log(indexes('aeeaaaaadjfhfnaaaaadjddjaa', 'aaaa'));
// // // console.log(indexes('wordgoodwordgoodgoodbestword', 'wordgood'));
// // // console.log(indexes('I learned to play the Ukulele in Lebanon.', 'le'));

// // // var str =
// // // 	'{Ready Player One, budget: 175000000, vote_average: 7.6, runtime: 140000} {poster_path: /zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg,';
// // // var indices = [];
// // // for (var i = 0; i < str.length; i++) {
// // // 	if (str[i] === '} {poster_path' ) indices.push(i);
// // // }

// // // console.log(indices);
