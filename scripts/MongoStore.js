const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const mongUrl = 'mongodb://localhost:27017/';

// Mongo base class to actually interact with the DB
class MongoStore {
	constructor() {
		this.DB = process.env.MONGODB;
	}

	Get() {
		// mongoClient.connect(url, (err, db) => {
		// 	if (err) throw err;
		// 	const dbo = db.db('mydb');
		// 	dbo.collection('anotherone').insertOne({
		// 		data: 'object'
		// 	}, (err, res) => {
		// 		if (err) throw err;
		// 		console.log('inserted', res);
		// 		db.close();
		// 	});
		// });
	}

	GetAll(collection, query = {}, callback) {
		mongoClient.connect(mongUrl, (err, db) => {
			if (err) throw err;
			const dbo = db.db(this.DB);
			dbo.collection(collection).find(query).toArray((err, result) => {
				if (err) throw err;
				db.close();
				return callback(result);
			});
		});
	}

	Put(collection, data, callback) {
		// Make sure we are passing an array
		if (!Array.isArray(data)) {
			data = [data];
		}

		mongoClient.connect(mongUrl, (err, db) => {
			if (err) throw err;
			const dbo = db.db(this.DB);
			dbo.collection(collection).insertMany(data, (err, res) => {
				if (err) throw err;
				db.close();
				return callback(res);
			});
		});
	}
}

module.exports = MongoStore;