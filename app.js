const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');

const app = express();

app.use(express.static('./assets'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/test', (req, res) => res.sendFile(__dirname + '/test.html'));

