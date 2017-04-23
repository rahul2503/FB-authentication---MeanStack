var express = require('express');
var router = express.Router();
module.exports = router;

var FB = require('fb');

var Mongo = require('./mongoConfig');

module.exports.loginWithFB = function(req, res) {
	console.log("loginWithFB - server");

	var username = req.body.username;
	var dp_url = req.body.profile_pic;
	var fb_id = req.body.fb_id;

	var callbackUserSession = function(success, response) {
		console.log("callbackUserSession");

		if (success) {
			// var resp = JSON.parse(response);
			var resp = {
				'success': true,
				'user_id': JSON.parse(response)._id,
				'session_id': resp._id
			}

			reJSON.parse(response)sd(resp);
		} else {
			console.log("Error creating session");
			throw new Error('Error creating session');
		}
	}

	var callbackCreateSession = function(success, response) {
		console.log("callbackCreateSession");

		if (success) {
			var session = {
				'user_id': JSON.parse(response)._id,
				'login_status': true,
				'created_date': new Date()
			}
			// res.send(resp);
			Mongo.insert('T_USER_SESSION', session, callbackUserSession);
		} else {
			var resp = {
				'success': false,
				'reason': 'User Registration Failed'
			};

			res.send(resp);
		}
	}

	var callbackCheckUserExistence = function(success, response) {
		console.log("callbackCheckUserExistence");

		if (success) {
			var resp = {
				'success': false,
				'reason': 'User already Exists'
			};

			// Mongo.update('T_USER', {'login_status': true})
			res.send(resp);
		} else {
			var json = {
				'username': username,
				'dp_url': dp_url,
				'created_date': new Date(),
				'last_modified_date': new Date()
			}

			Mongo.insert('T_USER', json, callbackCreateSession);
		}
	}

	Mongo.retrieve('T_USER', {'fb_id': fb_id}, callbackCheckUserExistence);
};

module.exports.logoutFromFB = function(req, res) {
	console.log("logoutFromFB - server");
	var username = req.body.username;
	var username = req.body.user_id;

	Mongo.retrieve('T_USER', {'username': username}, callbackCheckUserStatus)
};
