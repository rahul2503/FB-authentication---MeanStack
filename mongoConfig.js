var mongoConfig = {};

mongo = require('mongodb')

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('authFB', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'authFB' database");
	}
});


module.exports.insert = function(collectionName, json, callback) {
	console.log("mongo insert");

	db.collection(collectionName, function (err, collection) {
		collection.insert(json, function(err, user) {
			if (err) {
				console.log("Error saving user into database");
				throw new Error('Error saving user into database'); 
			} else {
				console.dir("Inserted into Database");
				callback(true, JSON.stringify(user.ops[0]));
			}
		});
	});
};


module.exports.retrieve = function(collectionName, json, callback) {
	console.log("mongo retrieve");
	db.collection(collectionName, function (err, collection) {
		collection.find(json).toArray(function(err, user) {
			if (err) {
				console.log("error retrieving database");
				throw new Error('Error retrieving database'); 
			} else {
				if (user != '') {
					console.log("User Exists");
					callback(true, JSON.stringify(user[0]));
				} else {
					console.log("user does not exist: ");
					callback(false, {'reason': 'user does not exist'});
				}
			}
		});
	});
};


module.exports.update = function(collectionName, key, value, json, callback) {
	console.log("mongo update");

	var findDocument = {key, value};
	db.collection(collectionName, function (err, collection) {
		collection.update(findDocument, {$set: json}, function(err, user) {
			if (err) {
				console.log("Error updating user into database");
				callback({'success': false, 'reason': 'Failure updating database'})
			} else {
				console.log("Updated in database");
				callback(true);
			}
		});
	});
};


module.exports.delete = function(collectionName, json, callback) {
	console.log("mongo delete");

	db.collection(collectionName, function (err, collection) {
		collection.insert(json, function(err, user) {
			if (err) {
				console.log("Error saving user into database");
				callback({'success': false, 'reason': 'Failure deleting database'})
			} else {
				console.log("Deleted from database");
				callback(true);
			}
		});
	});
};
