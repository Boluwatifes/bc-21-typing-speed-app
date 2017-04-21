const express = require('express');
const bodyParser = require('body-parser');
var firebase = require('firebase');

const app = express();

// Firebase Configuration
const config = {
	apiKey: "AIzaSyC6nIqvcahbeuGtWogrsRzmwXBk7Bjl5rQ",
	authDomain: "test-project-3341a.firebaseapp.com",
	databaseURL: "https://test-project-3341a.firebaseio.com",
	projectId: "test-project-3341a",
	storageBucket: "test-project-3341a.appspot.com",
	messagingSenderId: "881454952815"
};

// Initialize firebase
firebase.initializeApp(config);

// Set the database collection 
const ref = firebase.database().ref();

// Serve static files
app.use(express.static('./assets'));

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Set the view engine to Embedded Javascript
app.set('view engine', 'ejs');

// Set EXPRESS port
app.listen(process.env.PORT || 3000);

// Listen and respond to GET request on the index route
app.get('/', (req, res) => {
	res.render('index');
});

// Listen and respond to GET request on the test route
app.get('/test', (req, res) => {
	res.render('test');
});

// Listen and respond to GET request on the leaderboard route
app.get('/leaderboard', (req, res) => {
	// set new collection
	let childRef = ref.child('results');

	// Get data from firebase database
	childRef.once('value', (snap) => {
		let dbData = snap.val();
		let holdData = [];

		// Loop through the data received from the database and save it to the `holdData` variable
		for(const data in dbData){
			const temp = {};
			temp.name = dbData[data].name;
			temp.wpm = parseInt(dbData[data].wpm);
			temp.nwpm = dbData[data].nwpm;
			temp.errors = dbData[data].errors;
			temp.accuracy = dbData[data].accuracy;
			holdData.push(temp);
		}

		// Sort the data in decending order
		holdData.sort((a,b) => {
			return (b.wpm > a.wpm) ? 1 : ((a.wpm > b.wpm) ? -1 : 0);
		});

		// Renders the leaderboard.ejs file
		res.render('leaderboard', { 
		    results: holdData,
		});
	});
});

// Handle POST request from the test page and save data to the database
app.post('/saveUser', (req, res) => {
  let newData = req.body;
	let resRef = ref.child('results');
	let newRes = resRef.push(newData);
	res.send({ success: true});
})