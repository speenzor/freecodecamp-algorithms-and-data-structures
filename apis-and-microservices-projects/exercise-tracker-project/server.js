//Import dependencies
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const mongo = require('mongodb')

//Setup database
mongoose.connect(process.env.MLAB_URI)

//Allow cross-origin resource sharing
app.use(cors())

//Mount body parser to parse POST bodies
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

//Serve html file at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Create Schema and Models
const Schema = mongoose.Schema;
const exerciseSchema = new Schema ({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: String}
});
const userSchema = new Schema ({
  username: {type: String, required: true},
  log: []
});
const Model = mongoose.model('Model', userSchema);


//GET user's exercise log
app.get('/api/exercise/log', (req, res) => {
  const userId = req.query.userId;
  
  //Setup defaults for from and to variables
  let from = req.query.from;
  let to = req.query.to;
  const getTime = (query) => new Date(query).getTime();
  if (isNaN(getTime(from))) {
    from = 0;
  } else {
    from = getTime(from);
  };
  if (isNaN(getTime(to))) {
    to = getTime('9000');
  } else {
    to = getTime(to);
  };
  
  //Setup defaults for limit variable
  let limit = req.query.limit; //optional
  //Set limit to empty string if limit input is NaN or is empty
  if (limit === '' || isNaN(Number(limit))) {
    limit = '';
  } else {
    limit = Number(limit);
  };

  //READ: check for userId first
  Model.findById({_id: userId}, (err, data) => {
    console.log('Checking database for userId.');
    console.log(data);
    if (data == false || data == undefined) {
      //If data is an empty array then the userId doesn't exist
      console.log('userId does not exist.');
      res.json('This userId does not exist.');
    } else {
      //Return data with log based on from, to, limit parameters
      const rawLog = data.log;
      const filteredLog = rawLog.filter(entry => new Date(entry.date).getTime() >= from && new Date(entry.date).getTime() <= to);
      let returnLog = [];
      if (limit !== '') {
        if (filteredLog.length <= limit) {
          returnLog = filteredLog;
        } else {
          returnLog = filteredLog.slice(0, limit);
        };
      } else {
        returnLog = filteredLog;
      };
      res.json({_id: data._id, username: data.username, count: returnLog.length, log: returnLog});
    }
  });
});

//New user POST
app.post('/api/exercise/new-user', (req, res) => {
  const username = req.body.username;
  //READ: Check if username exists in database
  Model.find({username: username}, (err, data) => {
    console.log('Checking database if new username already exists.');
    console.log(data);
    //If it returns an empty array then the username is not taken and should evaluate to false
    if (data == true) {
      //If username already exists then return message
      console.log('Username already exists.');
      return res.json("Username already taken. Please try another username.");
    } else {
      //CREATE: If username doesn't exist then create new username
      console.log('New username created and added to database.');
      const newUser = new Model({
        username: username,
        log: []
      });
      newUser.save((err, data) => {
        if (err) {
          console.log('Error in saving new user.');
        };
        console.log('New user succesfully saved and returned:');
        console.log('Data: ' + data);
        return res.json({'username': data.username, '_id': data._id});
      });
    }
    if (err) {
      console.log('Error in creating new user: ' + err);
    };
    console.log('New username POST completed.');
  });
});

//New exercise POST
app.post('/api/exercise/add', (req, res) => {
  const userId = req.body.userId;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  let date = req.body.date;
  //If date is empty then set to today's date
  if (date === '') {
    date = new Date(Date.now()).toUTCString().slice(0,16);
  } else {
    date = new Date(date).toUTCString().slice(0,16);
  };
  
  if (description == false) {
    //Check if description is filled out
    res.json('New exercise requires a description.');
  } else if (duration == false) {
    //Check if duration is filled out
    res.json('New exercise requires a duration.');
  } else if (Number.isNaN(duration)) {
    //Check if duration is a number
    res.json('Duration needs to be a number.');
  } else if (new Date(date).toUTCString() === 'Invalid Date') {
    //Check if date is correct format
    res.json('Date needs to be in correct format.');
  } else {
    //Find and update by _id
    const newExercise = {
          description: description,
          duration: duration,
          date: date
        };
    Model.findByIdAndUpdate({_id: userId}, {$push: {log: newExercise}}, {new: true}, (err, data) => {
      console.log('New exercise pushed to log of user: ' + data.username);
      res.json({username: data.username, description: description, duration: duration, _id: data._id, date: date});
    });
  };
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error-handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
});

//Setup port configuration and listen
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});