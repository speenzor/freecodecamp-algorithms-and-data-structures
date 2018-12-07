'use strict';

//Import dependencies
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var dns = require('dns');

// Basic port configuration 
var port = process.env.PORT || 3000;

//Setup database
mongoose.connect(process.env.MONGO_URI);

//Cross-origin resource sharing. Tells a browser to let a
//web app have permission to access selected resources from
//a server at a different origin
app.use(cors());

//Mount body parser to parse POST bodies
app.use(bodyParser.urlencoded({extended: false}));

//http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(process.cwd() + '/public'));

//Create Schema and Model
const Schema = mongoose.Schema;
const urlSchema = new Schema ({
  original_url: {type: String, required: true},
  short_url: {type: String}
});
const Model = mongoose.model('Model', urlSchema);

//Serve html file at root
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

//API endpoint for URL shortener to get input from client
app.get('/api/shorturl/:short_url_number', (req, res) => {
  //Check if shortened URL exists in database
  const short_url_number = req.params.short_url_number;
  Model.find({short_url: short_url_number}, (err, data) => {
    if (data == false) {
      //If shortened URL doesn't exist then redirect to homepage
      console.log('The shortened URL requested doesn\'t exist in the database.');
      res.redirect('/');
    } else {
      console.log('The shortened URL requested exists in database.');
      //If shortened URL does exist then redirect to it's original URL
      res.redirect(data[0].original_url);
    };
    if (err) {
      console.log('Error from checking database for shortened url: ' + err);
    };
    console.log('Done checking database for shortened URL.');
  });
});

//POST
app.post('/api/shorturl/new', (req, res) => {
  //Check if URL is valid
  const original_url = req.body.url;
  const lookup_url = original_url.replace(/https:\/\/|http:\/\/|www./g, '');
  dns.lookup(lookup_url, (err, address, family) => {
    if (!err) {
      //If err is null then there's no error, so store original and new short URL in db
      //Check database for last used number
      Model.count({}, (err, count) => {
        //Get number of documents in db for use in next short URL number
        console.log('There are this many documents: ' + count);
        const next_number = count + 1;
        const new_url = new Model({
          original_url: original_url,
          short_url: next_number
        });
        new_url.save((err, data) => {
          if (err) {
            console.log('Error in saving: ' + err);
          };
          console.log('New URL saved.');
        });
        return res.json({'original_url': `${original_url}`, 'short_url': next_number});
      });
    } else {
      //If err is truthy then there's an error, so return invalid URL JSON
      return res.json({'error': 'invalid URL'});
    }
  });
});

//Listen at specified port or port 3000
app.listen(port, function () {
  console.log('Node.js listening on port ' + this.address().port);
});