const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const mongUrl = 'mongodb://localhost:27017/';

// Mongo base class to actually interact with the DB
class MongoStore {
	constructor(collection) {
		this.DB = process.env.MONGODB;
		this.collection = collection.toString();
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

	GetAll(query = {}, callback) {
		mongoClient.connect(mongUrl, (err, db) => {
			if (err) throw err;
			const dbo = db.db(this.DB);
			dbo.collection(this.collection).find(query).toArray((err, result) => {
				if (err) throw err;
				db.close();
				return callback(result);
			});
		});
	}

	PutUpdate(data, callback) {
		mongoClient.connect(mongUrl, (err, db) => {
			if (err) throw err;
			const dbo = db.db(this.DB);
			data.lastSaved = Date.now();
			dbo.collection(this.collection).update({_id: data._id}, data, {upsert: true}, (err, res) => {
				if (err) throw err;
				db.close();
				callback(res);
			});
		});
	}

	PutMany(data, callback) {
		// Make sure we are passing an array
		if (!Array.isArray(data)) {
			data = [data];
		}

		mongoClient.connect(mongUrl, (err, db) => {
			if (err) throw err;
			const dbo = db.db(this.DB);
			dbo.collection(this.collection).insertMany(data, (err, res) => {
				if (err) throw err;
				db.close();
				return callback(res);
			});
		});
	}
}

module.exports = MongoStore;