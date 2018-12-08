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
  date: {type: Date, default: Date.now}
});
const userSchema = new Schema ({
  username: {type: String, required: true},
  count: Number,
  log: [exerciseSchema]
});
const Model = mongoose.model('Model', userSchema);


//GET user's exercise log
app.get('/api/exercise/log', (req, res) => {
  const userId = req.query.userId; //required
  const from = req.query.from; //optional
  const to = req.query.to; //optional
  const limit = req.query.limit; //optional
  
  //READ: check for userId first. If doesn't exist then return something
  //Return is logic based on from, to, and limit parameters
  //Returns: {"_id":"By9gIsu14","username":"scorwin","count":1,"log":[{"description":"4","duration":34,"date":"Sat Dec 08 2018"}]}
});

//New user POST
app.post('/api/exercise/new-user', (req, res) => {
  const username = req.body.username;
  //READ: Check if username exists in database
  Model.find({username: username}, (err, data) => {
    console.log('Checking database if new username already exists.');
    if (data) {
      //If username already exists then return message
      console.log('Username already exists.');
      return "Username already taken. Please try another username."
    } else {
      //CREATE: If username doesn't exist then create new username
      console.log('New username created and added to database.');
      const newUser = new Model({
        username: username,
        count: 0,
        log: []
      });
      newUser.save((err, data) => {
        //NEED TO GET THE USER ID FROM data to add to json response below
        if (err) {
          console.log(''); //ADD HEREEEEEEEEEEE
        };
        console.log(''); //ADD HEREEEEEEEEEEE
      });
      return res.json({'username': username, '_id': ''}); //ADD HEREEEEEEEEEEE
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
  const duration = req.body.duration;
  const date = req.body.date;
  
  //Find and update by _id
  //First check if userId exists
  //Then check if description is filled out
  //Then check if duration is filled out
  //Then check if duration is correct format (number)
  //If date is filled out then check if correct format
  //Require userId, description, duration
  //Check database for record by _id
  //If id does not exist then return something "That userId does not exist. Go back to
  //homepage to create a new username and get a unique userId
  //If id does exist then add and return {'username': '', 'description': '', 'duration', '_id': '', 'date': if no input then current date "Sat Dec 08 2018"}
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

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
})

//Setup port configuration and listen
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
