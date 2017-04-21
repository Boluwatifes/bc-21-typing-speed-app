const express = require('express');
const bodyParser = require('body-parser');
var firebase = require('firebase');

const app = express();

// Initialize Firebase
const config = {
	apiKey: "AIzaSyC6nIqvcahbeuGtWogrsRzmwXBk7Bjl5rQ",
	authDomain: "test-project-3341a.firebaseapp.com",
	databaseURL: "https://test-project-3341a.firebaseio.com",
	projectId: "test-project-3341a",
	storageBucket: "test-project-3341a.appspot.com",
	messagingSenderId: "881454952815"
};

firebase.initializeApp(config);

const ref = firebase.database().ref();

app.use(express.static('./assets'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/test', (req, res) => res.sendFile(__dirname + '/test.html'));

app.get('/leaderboard', (req, res) => {
	let childRef = ref.child('results');
	childRef.once('value', (snap) => {
		res.render('leaderboard', { 
		    results: snap.val(),
		});
	});
});

app.post('/saveUser', (req, res) => {
	let newData = req.body;
	let resRef = ref.child('results');
	let newRes = resRef.push(newData);
	res.send({ success: true});
})