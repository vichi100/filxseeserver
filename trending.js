const axios = require('axios');

const sleep = (milliseconds) => {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
};

const getTopRatedMovie = () => {
	axios
		.get(
			'https://api.themoviedb.org/3/trending/all/week?api_key=8c643e62fa2e9201b30ef1f251603347&language=en-US&page=3&region=IN'
		)
		.then((response) => {
			// console.log('TopRatedMovie: ', response.data.results);
			const movieDataArray = response.data.results;
			const tmdbIdArray = [];
			movieDataArray.map((item) => {
				const tmdbId = item.media_type + '/' + item.id;
				tmdbIdArray.push(tmdbId);
				// sleep(1000);
				// console.log()

				// console.log(x);
				// tmdbIdArray.push(x);
			});

			console.log(tmdbIdArray);
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
};

console.log(getTopRatedMovie());

// 9685065678 -
