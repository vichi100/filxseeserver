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
			'https://api.themoviedb.org/3/trending/all/week?api_key=8c643e62fa2e9201b30ef1f251603347&language=en-US&page=1&region=IN'
		)
		.then((response) => {
			// console.log('TopRatedMovie: ', response.data.results);
			const movieDataArray = response.data.results;
			const tmdbIdArray = [];
			movieDataArray.map((item) => {
				const tmdbId = item.media_type + '/' + item.id;
				sleep(1000);
				// console.log()
				var options = {
					method: 'GET',
					url: 'https://streaming-availability.p.rapidapi.com/get/basic',
					params: { country: 'in', tmdb_id: tmdbId },
					headers: {
						'x-rapidapi-key': '03fe41fbaamsh36e3caed36bbea5p18c791jsndbf3b6fe4482',
						'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
					}
				};

				axios
					.request(options)
					.then((response) => {
						const x = response.data;
						if (Object.keys(x.streamingInfo).length > 0) {
							console.log(response.data);
						}
					})
					.catch((error) => {
						console.error(error);
					});
				// console.log(x);
				// tmdbIdArray.push(x);
			});

			return response.data;
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
};

console.log(getTopRatedMovie());

// 9685065678 -
