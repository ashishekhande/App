require("@babel/register");
require("@babel/polyfill");

var express = require('express');
var app = express();
var fs = require("fs");
const publishToQueue  = require('./services/MQService');

// // https: //firebase.google.com/docs/admin/setup/
var admin = require("firebase-admin");

var serviceAccount = require("../App/js/cred/august-craft-248718-firebase-adminsdk-dr3s9-f86f4402ed.json");

var fb = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://august-craft-248718.firebaseio.com"
});


const db = admin.firestore();

app.use(express.static('../App'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
});


app.get('/showbookings', function (req, res, next) {
	const ref1 = db.collection('Foodie').get();

	console.log(ref1);
	ref1.then(function (value) {
		console.log('get success');
		console.log(value);

		const bookings = [];

		value.forEach((doc) => {
			bookings.push({
				id: doc.id,
				data: doc.data()
			});
		});

		console.log(bookings);
		res.json(bookings);

	}).catch(
		// Log the rejection reason
		(reason) => {
			res.end(
				'Handle rejected promise (' + JSON.stringify(reason, 1) + ') here.'
			);
		});
})



app.get('/booktable', function (req, res, next) {
	try {
		// const text = req.body.text;
		// if (!text) throw new Error('Text is blank');
		// // const data = { text };
		const ref = db.collection('Foodie').add(req.query);

		ref.then(function (value) {
			console.log('add success');
			console.log(value);

			const rabit = publishToQueue(JSON.stringify(req.query));

			rabit.then(function() {
				console.log("Rabit-mq success")
			}).catch((e) => {
				console.log("something went wrong with rabit mq" + e) 
			})
		}).catch(
			// Log the rejection reason
			(reason) => {
				console.log('Handle rejected promise (' + reason + ') here.');
		});

		// let data = req.query;
		// res.json({
		// 	id: ref.id,
		// 	data
		// });


		res.end(
			'<b>Table at hotel <h4>' + req.query['hotelName'] + ' </h4>has been booked successfully at time <h4>' + req.query['time'] + ' </h4></b></br>'
			+ '<h2>Details<h2></br>' + JSON.stringify(req.query)
			+ '</br><h1>Happy Fooding  !!!!!!<h1>'
			// + '</br><a href = "/loggedin.html">Back</a>'
			+ '</br><div onclick = top.location.replace("loggedin.html")>Back</div>'
		);

	} catch (e) {
		res.end(e);
	}
})

// app.get('/booktable', function (req, res, next) {
// 	data = JSON.parse(data);

// 	data["user4"] = req.query;
	
// 	fs.readFile(__dirname + "/" + "booking.json", 'utf8', function (err, data) {
// 		// console.log(req.query);
// 		data = JSON.parse(data);
// 		// console.log(data)
// 		data["user4"] = req.query;
// 		// console.log(data);

// 			try {
// 				// const text = req.body.text;
// 				// if (!text) throw new Error('Text is blank');
// 				// // const data = { text };
// 				const ref = db.collection('Foodie').add(req.query);

// 				ref.then(function (value) {
// 					console.log(value);
// 				}).catch(
// 					// Log the rejection reason
// 					(reason) => {
// 						console.log('Handle rejected promise (' + reason + ') here.');
// 					});

// 				res.json({
// 					id: ref.id,
// 					data
// 				});
// 			} catch (e) {
// 				next(e);
// 			}

// 		// publishToQueue(data);

// 		res.statusCode = 200;
// 		res.data = {"message-sent":true};
		
// 		res.end(
// 			'<b>Table at hotel <h4>' + req.query['hotelName'] + ' </h4>has been booked successfully at time <h4>' + req.query['time']  +' </h4></b></br>'
// 			+'<h2>Details<h2></br>' + JSON.stringify(data)
// 			+'</br><h1>Happy Fooding  !!!!!!<h1>'
// 			// + '</br><a href = "/loggedin.html">Back</a>'
// 			+ '</br><div onclick = top.location.replace("loggedin.html")>Back</div>'
			 
// 		);
// 	});

// })

app.get('/', function (req, res) {
	res.send('Hello World');
})

var user = {
	"user4": {
		"name": "mohit",
		"password": "password4",
		"profession": "teacher",
		"id": 4
	}
}

app.post('/addUser', function (req, res) {
	// First read existing users.
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		data["user4"] = user["user4"];
		console.log(data);
		res.end(JSON.stringify(data));
	});
})

var server = app.listen(2121, function () {
	debugger;
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})	