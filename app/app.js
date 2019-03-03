require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.use('/favicon.ico', router);
app.use('/', router);
app.use('/createlist', router);
app.use('/:customListName', router);
app.use('/delete', router);

app.listen(3000, function(){
    console.log('The server is running on port 3000');
})