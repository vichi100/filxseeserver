const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const utilSchema = new Schema({
	genres: {},
	years: [],
	category: [],
	ott_provider: {} // {netflix: icon_image_url}
});

module.exports = mongoose.model('Util', utilSchema);
