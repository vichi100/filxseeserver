var axios = require('axios').default;
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Util = require('./models/util');
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

Movie.distinct('release_date')
	// .sort({ release_date: -1 })
	.then((result) => {
		console.log(result);
		Util.collection
			.insertOne({
				genres: genresX,
				years: result.sort().reverse()
			})
			.then((res) => {
				console.log(result);
			});
	})
	.catch((err) => {
		console.log(err);
	});

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
