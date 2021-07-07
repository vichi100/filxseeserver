var axios = require('axios').default;
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

const Util = require('./models/util');

const OTTProviderDict = {
	netflix: '/image/provider/netflix.jpeg',
	prime: '/image/provider/prime.jpeg',
	erosnow: '/image/provider/erosnow.jpeg',
	hotstar: '/image/provider/hotstar.jpeg',
	jiocinema: '/image/provider/jiocinema.jpeg',
	sonyliv: '/image/provider/sonyliv.jpeg',
	zee5: '/image/provider/zee5.jpeg'
};

mongoose
	.connect('mongodb+srv://vichi:vichi123@cluster0.emt5x.mongodb.net/flicksick_india?retryWrites=true&w=majority')
	.then(() => {
		console.log('MongoDB connected...server listening at 3000');
	})
	.catch((err) => console.log(err));

Util.collection
	.updateOne(
		{ _id: ObjectId('60b25af0ce6e65463c414d66') },
		{
			$set: { ott_provider: OTTProviderDict }
		}
	)
	.then((result) => {
		console.log('success');
	});
