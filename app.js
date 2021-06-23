const express = require('express');
const bodyParser = require('body-parser');
var busboy = require('connect-busboy');
const mongoose = require('mongoose');
const path = require('path'); //used for file path
var uuid = require('uuid');
const { nanoid } = require('nanoid');
const axios = require('axios');
const Constants = require('./constants');
var ObjectId = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const Schema = mongoose.Schema;
// import { diff } from './util';

// The Movie Database
const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb('8c643e62fa2e9201b30ef1f251603347');

// 2 Factor API
const OTP_API = 'd19dd3b7-fc3f-11e7-a328-0200cd936042';

// The omdb
const omdb = new (require('omdbapi'))('b6aff899');

// https://in.pinterest.com/pin/677299231444826508/
// https://github.com/grantholle/moviedb-promise
// https://github.com/vankasteelj/omdbapi

const User = require('./models/user');
const TrendingToday = require('./models/trendingToday');
const TrendingThisWeek = require('./models/trendingThisWeek');
const Movie = require('./models/movie');
const HomeData = require('./models/homeData');
const OMDBDocument = require('./models/omdb');
const UserAction = require('./models/userAction');
const MovieRating = require('./models/movieRating');
const UserContacts = require('./models/userContacts');
const AllUsers = require('./models/allUsers');
const Util = require('./models/util');

const RATTING_ARRAY = [ 'loved_it', 'dumb_but_entertaining', 'just_time_pass', 'worthless' ];

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	// res.header(
	//   "Access-Control-Allow-Methods",
	//   "GET,PUT,POST,DELETE,PATCH,OPTIONS"
	// );
	// res.header(
	//   //"Access-Control-Allow-Headers",
	//   "Origin, X-Requested-With, Content-Type, Accept"
	// );
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');

	next();
});

// start: Connect to DB
// const dbURL = 'mongodb+srv://vichi:vichi123@cluster0.3gcit.mongodb.net/flixsee?retryWrites=true&w=majority'
const dbURL = 'mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net/flicksick_india?retryWrites=true&w=majority';
mongoose
	.connect(dbURL)
	.then(() => {
		// app.listen(6000 ,'0.0.0.0');
		app.listen(3090, '0.0.0.0', () => {
			console.log('server is listening on 3000 port');
		});

		console.log('MongoDB connected...server listening at 3000');
	})
	.catch((err) => console.log(err));

// end: Connect to DB

app.post('/getUserDetails', function(req, res) {
	console.log('getUserDetails');
	getUserDetails(req, res);
});

app.post('/getTopMoviesOfTheYear', function(req, res) {
	console.log('getTopMoviesOfTheYear');
	getTopMoviesOfTheYear(req, res);
});

app.post('/getUtilData', function(req, res) {
	console.log('getUtilData');
	getUtilData(req, res);
});

app.post('/generateOTP', function(req, res) {
	console.log('generateOTP');
	generateOTP(req, res);
});

app.post('/getHomeScreenData', function(req, res) {
	console.log('getHomeScreenData');
	getHomeScreenData(req, res);
});

app.post('/getMovieByCategory', function(req, res) {
	console.log('getMovieByCategory');
	getMovieByCategory(req, res);
});

app.post('/searchMovieByTitle', function(req, res) {
	console.log('searchMovieByTitle');
	searchMovieByTitle(req, res);
});

app.post('/fetchOnScrollUpMovies', function(req, res) {
	console.log('fetchOnScrollUpMovies');
	fetchOnScrollUpMovies(req, res);
});

app.post('/fetchOnScrollDownMovies', function(req, res) {
	console.log('fetchOnScrollDownMovies');
	fetchOnScrollDownMovies(req, res);
});

app.post('/getFriendsData', function(req, res) {
	console.log('getFriendsData');
	getFriendsData(req, res);
});

app.post('/saveNewContact', function(req, res) {
	console.log('saveNewContact');
	saveNewContact(req, res);
});

app.post('/getMovieDetailData', function(req, res) {
	console.log('getMovieDetailData');
	getMovieDetailData(req, res);
});

app.post('/addRatingAndSeenFlag', function(req, res) {
	console.log('addRatingAndSeenFlag');
	addRatingAndSeenFlag(req, res);
});

const getUtilData = (req, res) => {
	console.log(JSON.stringify(req.body));
	const obj = JSON.parse(JSON.stringify(req.body));
	Util.find({})
		.then((result) => {
			res.send(JSON.stringify(result));
			res.end();
			// console.log('response sent');
			return;
		})
		.catch((err) => {
			console.error(`getUtilData# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify('fail'));
			res.end();
			return;
		});
};

const generateOTP = (req, res) => {
	console.log(JSON.stringify(req.body));
	const obj = JSON.parse(JSON.stringify(req.body));
	const mobile = obj.mobile;
	const OTP = obj.otp;

	axios
		.get(`https://2factor.in/API/V1/${OTP_API}/SMS/${mobile}/${OTP}`)
		.then((response) => {
			// console.log(response);
			res.send(JSON.stringify('success'));
			res.end();
			// console.log('response sent');
			return;
		})
		.catch((err) => {
			console.error(`generateOTP# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify('fail'));
			res.end();
			return;
		});
};

const getMovieByCategory = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.parse(JSON.stringify(req.body)));
	const category = obj.category;
	const document = obj.document;
	var categorySchema = new Schema({}, { strict: false });
	// var Category = mongoose.model(document);
	// if (Category) {
	// 	Category = mongoose.model(document, categorySchema);
	// }
	var Category = mongoose.model(document, categorySchema);
	Category.find({})
		.then((result) => {
			// console.log(result);
			res.send(JSON.stringify(result));
			res.end();
			delete mongoose.connection.models[document];
			return;
		})
		.catch((err) => {
			console.log(err.code);
			if (err instanceof OverwriteModelError) {
				console.log('here');
				Category.find({})
					.then((result) => {
						console.log(result);
						res.send(JSON.stringify(result));
						res.end();
						return;
					})
					.catch((err) => {
						console.error(`getMovieByCategory # Failed to fetch data from ${document} by name: ${err}`);
						res.send(JSON.stringify(null));
						res.end();
						return;
					});
			} else {
				console.error(`getMovieByCategory # Failed to fetch data from ${document} by name: ${err}`);
				res.send(JSON.stringify(null));
				res.end();
				return;
			}
		});
};

const getHomeScreenData = (req, res) => {
	const restaurantObj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	// media_type: 'all'|'movie'|'tv'|'person'
	// time_window: 'day'|'week'
	// const trendingToday = TrendingToday.find({}).exec();
	// const trendingThisWeek = TrendingThisWeek.find({}).exec();

	// START: THESE TWO ARE FOR TESTING REMOVE BEFORE PRODUCTION
	const friendList = HomeData.find({}).limit(8).exec();
	const trendingToday = HomeData.find({}).limit(8).exec();

	// var romComSchema = new Schema({}, { strict: false });
	// var RomCom = mongoose.model('romcoms', romComSchema);
	// const romcomData = RomCom.find({}).exec();

	const masterCut = Movie.find({}).limit(8).exec();
	//END
	Promise.all([ friendList, trendingToday ])
		.then(([ res1, res2 ]) => {
			// console.log('Results trendingCurrentWeek: ', res2.results);
			const homeScreenData = [
				{
					title: 'What Your Friends Watching',
					data: res1
				},
				{
					title: 'Trending...',
					data: res2
				}
			];

			res.send(JSON.stringify(homeScreenData));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`getHomeScreenData# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify([]));
			res.end();
			return;
		});
};

const searchMovieByTitle = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.parse(JSON.stringify(req.body)));
	const title = obj.title;
	Movie.find({ title: { $regex: title, $options: 'i' } })
		.then((result) => {
			res.send(JSON.stringify(result));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`searchMovieByTitle # Failed to fetch data from Movies by name: ${err}`);
			res.send(JSON.stringify(null));
			res.end();
			return;
		});
	// db.users.find({"name": /m/})
};

const fetchOnScrollUpMovies = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.parse(JSON.stringify(req.body)));
	const objId = obj.id;
	if (obj.id === '0') {
		Movie.find({})
			.sort({
				_id: 1
			})
			.limit(8)
			.then((result) => {
				res.send(JSON.stringify(result));
				res.end();
				return;
			})
			.catch((err) => {
				console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
				res.send(JSON.stringify(null));
				res.end();
				return;
			});
	} else {
		Movie.find({ _id: { $lt: ObjectId(objId) } })
			.sort({
				_id: -1
			})
			.limit(8)
			.then((result) => {
				// console.log(JSON.stringify(result));
				var tempX = result.sort((a, b) => {
					if (a._id > b._id) {
						return 1;
					} else if (b._id > a._id) {
						return -1;
					} else if (a._id === b._id) {
						return 0;
					}
				});
				res.send(JSON.stringify(tempX));
				res.end();
				return;
			})
			.catch((err) => {
				console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
				res.send(JSON.stringify(null));
				res.end();
				return;
			});
	}
};

const fetchOnScrollDownMovies = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log('fetchOnScrollDownMovies', JSON.parse(JSON.stringify(req.body)));
	const objId = obj.id; // this is ObjectId _id
	const genres = obj.genres;
	const releaseDate = obj.releaseDate;
	var query = null;
	if (genres.toUpperCase() == 'all'.toUpperCase() && releaseDate.toString().toUpperCase() === 'all'.toUpperCase()) {
		query = {};
	}
	if (genres.toUpperCase() !== 'all'.toUpperCase() && releaseDate.toString().toUpperCase() === 'all'.toUpperCase()) {
		query = { 'genres.name': { $in: [ genres ] } };
	}

	if (genres.toUpperCase() === 'all'.toUpperCase() && releaseDate.toString().toUpperCase() !== 'all'.toUpperCase()) {
		query = { release_date: releaseDate };
	}

	if (genres.toUpperCase() !== 'all'.toUpperCase() && releaseDate.toString().toUpperCase() !== 'all'.toUpperCase()) {
		query = { 'genres.name': { $in: [ genres ] }, release_date: releaseDate };
	}
	// const query = { 'genres.name': { $in: [ genres ] } };
	if (obj.id === 0) {
		// console.log('1');
		// console.log('query: ', query);
		Movie.find(query)
			.sort({
				// _id: 1,
				imdb_rating: -1
			})
			.limit(50)
			.then((result) => {
				res.send(JSON.stringify(result));
				res.end();
				return;
			})
			.catch((err) => {
				console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
				res.send(JSON.stringify(null));
				res.end();
				return;
			});
	} else {
		// console.log('2');
		query['_id'] = { $gt: ObjectId(objId) };
		// console.log('query: ', query);
		Movie.find(query)
			.sort({
				// _id: 1,
				imdb_rating: -1
			})
			.skip(50)
			.limit(50)
			.then((result) => {
				// console.log('result: ', JSON.stringify(result[7].genres));
				res.send(JSON.stringify(result));
				res.end();
				return;
			})
			.catch((err) => {
				console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
				res.send(JSON.stringify(null));
				res.end();
				return;
			});
	}
};

const fetchOnScrollDownMoviesX = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log('fetchOnScrollDownMovies', JSON.parse(JSON.stringify(req.body)));
	const objId = obj.id; // this is ObjectId _id
	const genres = obj.genres;
	const releaseDate = obj.releaseDate;
	var query = null;
	if (genres.toUpperCase() == 'all'.toUpperCase() && releaseDate.toString.toUpperCase === 'all'.toUpperCase()) {
		query = {};
	}
	if (genres.toUpperCase() !== 'all'.toUpperCase() && releaseDate.toString.toUpperCase === 'all'.toUpperCase()) {
		query = { 'genres.name': { $in: [ genres ] } };
	}

	if (genres.toUpperCase() === 'all'.toUpperCase() && releaseDate.toString.toUpperCase !== 'all'.toUpperCase()) {
		query = { release_date: releaseDate };
	}

	if (genres.toUpperCase() !== 'all'.toUpperCase() && releaseDate.toString.toUpperCase !== 'all'.toUpperCase()) {
		query = { 'genres.name': { $in: [ genres ] }, release_date: releaseDate };
	}
	// const query = { 'genres.name': { $in: [ genres ] } };
	if (obj.id === '0') {
		// console.log('1');
		if (genres.toUpperCase() !== 'all'.toUpperCase()) {
			Movie.find(query)
				.sort({
					_id: 1
				})
				.limit(50)
				.then((result) => {
					res.send(JSON.stringify(result));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		} else {
			// console.log('2');
			Movie.find({})
				.sort({
					_id: 1
				})
				.limit(50)
				.then((result) => {
					res.send(JSON.stringify(result));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		}
	} else {
		if (genres.toUpperCase() !== 'all'.toUpperCase()) {
			// console.log('3');
			Movie.find({ _id: { $gt: ObjectId(objId) }, 'genres.name': { $in: [ genres ] } })
				.sort({
					_id: 1
				})
				.limit(50)
				.then((result) => {
					// console.log('result: ', JSON.stringify(result[7].genres));
					res.send(JSON.stringify(result));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		} else {
			// console.log('4');
			Movie.find({ _id: { $gt: ObjectId(objId) } })
				.sort({
					_id: 1
				})
				.limit(50)
				.then((result) => {
					res.send(JSON.stringify(result));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`fetchMovies # Failed to fetch data from Movies: ${err}`);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		}
	}
};

const getFriendsData = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.parse(JSON.stringify(req.body)));
	const user_id = obj.id;
	UserContacts.findOne({ id: user_id })
		.then((result) => {
			if (result) {
				res.send(JSON.stringify(result));
				res.end();
				return;
			} else {
				res.send(JSON.stringify({}));
				res.end();
				return;
			}
		})
		.catch((err) => {
			console.error(`getFriendsData # Failed to fetch data from UserContacts: ${err}`);
			res.send(JSON.stringify('fail'));
			res.end();
			return;
		});
};

const saveNewContact = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.parse(JSON.stringify(req.body)));
	const user_id = obj.id;
	const contacts = obj.contact_dict;
	UserContacts.findOne({ id: user_id }).then((result) => {
		if (result) {
			// console.log('contacts: ', result);
			const friendsOffDict = result.friends_off;
			const friendsOnDict = result.friends_on;
			const friendsBlockedDict = result.friends_blocked;
			const finalDict = { ...friendsOffDict, ...friendsOnDict, ...friendsBlockedDict };
			const diffsDict = diff(contacts, finalDict);
			const tempFriendsOff = { ...friendsOffDict, ...diffsDict };
			//TEST THIS BEFORE PROD
			UserContacts.collection
				.updateOne({ id: user_id }, { $set: { friends_off: tempFriendsOff } })
				.then((result) => {
					res.send(JSON.stringify('success'));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`saveNewContact1 # Failed to insert documents in UserContacts: ${err}`);
					res.send(JSON.stringify('fail'));
					res.end();
					return;
				});
		} else {
			UserContacts.collection
				.insertOne({
					id: user_id,
					friends_off: contacts,
					friends_on: {},
					friends_blocked: {}
				})
				.then((result) => {
					res.send(JSON.stringify('success'));
					res.end();
					return;
				})
				.catch((err) => {
					console.error(`saveNewContact2 # Failed to insert documents in UserContacts: ${err}`);
					res.send(JSON.stringify('fail'));
					res.end();
					return;
				});
		}
	});
};

const addRatingAndSeenFlag = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	const userId = obj.user_id;
	const mobile = obj.mobile;
	const fsIdStr = obj.fs_id.toString();
	const rating_code = obj.rating_code;
	const ratingStr = RATTING_ARRAY[Number(rating_code)];
	const newTemp = 'already_seen.' + fsIdStr;
	const newTempRating = 'rating.' + fsIdStr;
	console.log(ratingStr);
	const updateUserAction = UserAction.collection.updateOne(
		{ id: userId },
		{ $set: { [newTemp]: 'y', [newTempRating]: rating_code } },
		{ upsert: true }
	);

	const updateRating = Movie.collection.updateOne(
		{ fs_id: fsIdStr },
		{ $inc: { [ratingStr]: 1, total_votes: 1 } },
		{ upsert: true }
	);

	Promise.all([ updateUserAction, updateRating ])
		.then(([ result1, result2 ]) => {
			// console.log('result1: ', result1.result);
			// console.log('result2: ', result2);
			res.send(JSON.stringify('success'));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`addRatingAndSeenFlag# Failed to update documents : ${err}`);
			res.send(JSON.stringify('fail'));
			res.end();
			return;
		});
};

const addRatingAndSeenFlagX = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	const userId = obj.user_id;
	const mobile = obj.mobile;
	const fsIdStr = obj.fs_id.toString();
	const rating_code = obj.rating_code;
	const ratingStr = RATTING_ARRAY[Number(rating_code)];
	const newTemp = 'already_seen.' + fsIdStr;
	const newTempRating = 'rating.' + fsIdStr;
	console.log(ratingStr);
	const updateUserAction = UserAction.collection.updateOne(
		{ id: userId },
		{ $set: { [newTemp]: 'y', [newTempRating]: rating_code } },
		{ upsert: true }
	);

	const updateRating = MovieRating.collection.updateOne(
		{ fs_id: fsIdStr },
		{ $inc: { [ratingStr]: 1, total_votes: 1 } },
		{ upsert: true }
	);

	Promise.all([ updateUserAction, updateRating ])
		.then(([ result1, result2 ]) => {
			// console.log('result1: ', result1.result);
			// console.log('result2: ', result2);
			res.send(JSON.stringify('success'));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`addRatingAndSeenFlag# Failed to update documents : ${err}`);
			res.send(JSON.stringify('fail'));
			res.end();
			return;
		});
};

const getUserDetails = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	const mobileXX = obj.mobile;
	const nameXX = obj.name;
	User.findOne({ mobile: obj.mobile })
		.then((result) => {
			if (result) {
				res.send(JSON.stringify(result));
				res.end();
				return;
			} else {
				const userObj = {
					id: nanoid(),
					expo_token: '',
					name: null,
					country: obj.country,
					mobile: obj.mobile,
					create_date_time: new Date(Date.now()),
					update_date_time: new Date(Date.now())
				};
				User.collection
					.insertOne(userObj)
					.then((result) => {
						const temp = { [mobileXX]: nameXX };
						AllUsers.collection
							.updateOne({ id: 'All_Users' }, { $set: { users: temp } }, { upsert: true })
							.then((result) => {
								res.send(JSON.stringify(userObj));
								res.end();
								return;
							})
							.catch((err) => {
								console.error(`getUserDetails# Failed to insert documents in all_users: ${err}`);
								res.send(JSON.stringify(null));
								res.end();
								return;
							});
					})
					.catch((err) => {
						console.error(`getUserDetails# Failed to insert documents : ${err}`);
						res.send(JSON.stringify(null));
						res.end();
						return;
					});
			}
		})
		.catch((err) => {
			console.error(`getUserDetails# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify(null));
			res.end();
			return;
		});
};

const getTopMoviesOfTheYear = (req, res) => {
	const obj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	const releaseDate = obj.releaseDate;
	// Movie.find({ release_date: releaseDate }, { imdb_rating: { $gt: 30 } })
	Movie.find({ release_date: releaseDate, imdb_rating: { $gt: 80 } })
		.sort({ imdb_rating: -1 })
		.then((result) => {
			// console.log('result   : ' + result);
			res.send(JSON.stringify(result));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`getTopMoviesOfTheYear# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify([]));
			res.end();
			return;
		});
};

const getHomeScreenDataX = (req, res) => {
	const restaurantObj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	// media_type: 'all'|'movie'|'tv'|'person'
	// time_window: 'day'|'week'
	// const trendingToday = TrendingToday.find({}).exec();
	// const trendingThisWeek = TrendingThisWeek.find({}).exec();

	// START: THESE TWO ARE FOR TESTING REMOVE BEFORE PRODUCTION
	const trendingToday = Movie.find({}).exec();
	const trendingThisWeek = Movie.find({}).exec();
	//END
	Promise.all([ trendingToday, trendingThisWeek ])
		.then(([ res1, res2 ]) => {
			// console.log('Results trendingCurrentWeek: ', res2.results);
			const homeScreenData = {
				trending_today: res1,
				trending_current_week: res2
			};
			res.send(JSON.stringify(homeScreenData));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`getHomeScreenData# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify([]));
			res.end();
			return;
		});
};

const getMovieDetailData = (req, res) => {
	const subObj = JSON.parse(JSON.stringify(req.body));
	console.log('subObj: ', subObj);
	const fsID = subObj.id;
	console.log('fsID: ', fsID);
	Movie.findOne({ fs_id: fsID })
		.then((result) => {
			// console.log(result);
			res.send(result);
			res.end();
		})
		.catch((err) => {
			console.error(`getMovieDetailData# Failed to fetch documents : ${err}`);
			res.send(JSON.stringify([]));
			res.end();
			return;
		});
};

const getTopRatedMovie = () => {
	axios
		.get(
			'https://api.themoviedb.org/3/movie/top_rated?api_key=8c643e62fa2e9201b30ef1f251603347&language=en-US&page=1&region=IN'
		)
		.then((response) => {
			console.log('TopRatedMovie: ', response.data);
			// TMDBMovie.collection
			// 	.updateOne({ id: response.data.id }, { $setOnInsert: { ...response.data } }, { upsert: true })
			// 	.then((result) => {
			// 		return response.data;
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 		return null;
			// 	});
			return response.data;
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
};

const diff = (obj1, obj2) => {
	// Make sure an object to compare is provided
	if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}

	var diffs = {};
	var key;

	/**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
	var arraysMatch = function(arr1, arr2) {
		// Check if the arrays are the same length
		if (arr1.length !== arr2.length) return false;

		// Check if all items exist and are in the same order
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}

		// Otherwise, return true
		return true;
	};

	/**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
	var compare = function(item1, item2, key) {
		// Get the object type
		var type1 = Object.prototype.toString.call(item1);
		var type2 = Object.prototype.toString.call(item2);

		// If type2 is undefined it has been removed
		if (type2 === '[object Undefined]') {
			diffs[key] = item1;
			return;
		}

		// If items are different types
		if (type1 !== type2) {
			diffs[key] = item2;
			return;
		}

		// If an object, compare recursively
		if (type1 === '[object Object]') {
			var objDiff = diff(item1, item2);
			if (Object.keys(objDiff).length > 0) {
				diffs[key] = objDiff;
			}
			return;
		}

		// If an array, compare
		if (type1 === '[object Array]') {
			if (!arraysMatch(item1, item2)) {
				diffs[key] = item2;
			}
			return;
		}

		// Else if it's a function, convert to a string and compare
		// Otherwise, just compare
		if (type1 === '[object Function]') {
			if (item1.toString() !== item2.toString()) {
				diffs[key] = item2;
			}
		} else {
			if (item1 !== item2) {
				diffs[key] = item2;
			}
		}
	};

	//
	// Compare our objects
	//

	// Loop through the first object
	for (key in obj1) {
		if (obj1.hasOwnProperty(key)) {
			compare(obj1[key], obj2[key], key);
		}
	}

	// Loop through the second object and find missing items
	for (key in obj2) {
		if (obj2.hasOwnProperty(key)) {
			if (!obj1[key] && obj1[key] !== obj2[key]) {
				diffs[key] = obj2[key];
			}
		}
	}

	// Return the object of differences
	return diffs;
};

// https://api.themoviedb.org/3/movie/513310?api_key=26ba5e77849587dbd7df199727859189&language=en-US
//api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347

//  https://api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/images?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/images?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg

// https://image.tmdb.org/t/p/w300/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg

// https://api.themoviedb.org/3/movie/550/videos?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/watch/providers?api_key=8c643e62fa2e9201b30ef1f251603347

// https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJBbWF6b24gUHJpbWUgVmlkZW8iLCJtb25ldGl6YXRpb25UeXBlIjoiZmxhdHJhdGUiLCJwcmVzZW50YXRpb25UeXBlIjoiaGQiLCJjdXJyZW5jeSI6IklOUiIsInByaWNlIjowLCJvcmlnaW5hbFByaWNlIjowLCJhdWRpb0xhbmd1YWdlIjoiIiwic3VidGl0bGVMYW5ndWFnZSI6IiIsImNpbmVtYUlkIjowLCJzaG93dGltZSI6IiIsImlzRmF2b3JpdGVDaW5lbWEiOmZhbHNlLCJwYXJ0bmVySWQiOjYsInByb3ZpZGVySWQiOjExOSwiY2xpY2tvdXRUeXBlIjoianctY29udGVudC1wYXJ0bmVyLWV4cG9ydC1hcGkifX0seyJzY2hlbWEiOiJpZ2x1OmNvbS5qdXN0d2F0Y2gvdGl0bGVfY29udGV4dC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJ0aXRsZUlkIjo0MjQwOSwib2JqZWN0VHlwZSI6Im1vdmllIiwiandFbnRpdHlJZCI6InRtNDI0MDkiLCJzZWFzb25OdW1iZXIiOjAsImVwaXNvZGVOdW1iZXIiOjB9fV19&r=https%3A%2F%2Fapp.primevideo.com%2Fdetail%3Fgti%3Damzn1.dv.gti.48b0548f-fcfb-a628-6a3c-f0817a3f6c3a%26ie%3DUTF8%26linkCode%3Dxm2&uct_country=in" title="Watch Fight Club on Amazon Prime Video" target="_blank" rel="noopener"><img src="/t/p/original/68MNrwlkpF7WnmNPXLah69CR5cb.jpg" width="50" height="50">

// <a href="https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJWb290IiwibW9uZXRpemF0aW9uVHlwZSI6ImZsYXRyYXRlIiwicHJlc2VudGF0aW9uVHlwZSI6ImhkIiwiY3VycmVuY3kiOiJJTlIiLCJwcmljZSI6MCwib3JpZ2luYWxQcmljZSI6MCwiYXVkaW9MYW5ndWFnZSI6IiIsInN1YnRpdGxlTGFuZ3VhZ2UiOiIiLCJjaW5lbWFJZCI6MCwic2hvd3RpbWUiOiIiLCJpc0Zhdm9yaXRlQ2luZW1hIjpmYWxzZSwicGFydG5lcklkIjo2LCJwcm92aWRlcklkIjoxMjEsImNsaWNrb3V0VHlwZSI6Imp3LWNvbnRlbnQtcGFydG5lci1leHBvcnQtYXBpIn19LHsic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL3RpdGxlX2NvbnRleHQvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsidGl0bGVJZCI6NDI0MDksIm9iamVjdFR5cGUiOiJtb3ZpZSIsImp3RW50aXR5SWQiOiJ0bTQyNDA5Iiwic2Vhc29uTnVtYmVyIjowLCJlcGlzb2RlTnVtYmVyIjowfX1dfQ&r=https%3A%2F%2Fwww.voot.com%2Fmovie%2Ffight-club%2F621842&uct_country=in" title="Watch Fight Club on Voot" target="_blank" rel="noopener"><img src="/t/p/original/ycJT3Xh9E4OH3eW1QZ1OOR9pCCj.jpg" width="50" height="50"></a>

//  https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJBbWF6b24gUHJpbWUgVmlkZW8iLCJtb25ldGl6YXRpb25UeXBlIjoiZmxhdHJhdGUiLCJwcmVzZW50YXRpb25UeXBlIjoic2QiLCJjdXJyZW5jeSI6IklOUiIsInByaWNlIjowLCJvcmlnaW5hbFByaWNlIjowLCJhdWRpb0xhbmd1YWdlIjoiIiwic3VidGl0bGVMYW5ndWFnZSI6IiIsImNpbmVtYUlkIjowLCJzaG93dGltZSI6IiIsImlzRmF2b3JpdGVDaW5lbWEiOmZhbHNlLCJwYXJ0bmVySWQiOjYsInByb3ZpZGVySWQiOjExOSwiY2xpY2tvdXRUeXBlIjoianctY29udGVudC1wYXJ0bmVyLWV4cG9ydC1hcGkifX0seyJzY2hlbWEiOiJpZ2x1OmNvbS5qdXN0d2F0Y2gvdGl0bGVfY29udGV4dC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJ0aXRsZUlkIjo0MjQwOSwib2JqZWN0VHlwZSI6Im1vdmllIiwiandFbnRpdHlJZCI6InRtNDI0MDkiLCJzZWFzb25OdW1iZXIiOjAsImVwaXNvZGVOdW1iZXIiOjB9fV19&r=https%3A%2F%2Fapp.primevideo.com%2Fdetail%3Fgti%3Damzn1.dv.gti.48b0548f-fcfb-a628-6a3c-f0817a3f6c3a%26ie%3DUTF8%26linkCode%3Dxm2&uct_country=in" title="Watch Fight Club on Amazon Prime Video" target="_blank" rel="noopener"><img src="/t/p/original/68MNrwlkpF7WnmNPXLah69CR5cb.jpg" width="50" height="50"></a>

// https://rapidapi.com/search/movie
// https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability

//  Flick | Sick
// movie freak

// https://www.google.com/search?q=watching%20movie%20logo&tbm=isch&tbs=rimg:CcRUhbmpaj7fYZMnNPc_1FWsW&hl=en&sa=X&ved=0CB4QuIIBahcKEwi4_JD7zsXwAhUAAAAAHQAAAAAQAg&biw=1440&bih=632

// /usr/local/Cellar/mongodb-community-shell/4.2.0

// mongo "mongodb+srv://cluster0.emt5x.mongodb.net/flicksick_india" --username vichi

// j38DS7x9smN54Tp   209.145.57.26

// node_modules/react_scripts/start.js

// /root/flicksick/flicksick_web_app/node_modules/react-scripts/scripts/start.js

// pm2 start node_modules/react-scripts/scripts/start.js
