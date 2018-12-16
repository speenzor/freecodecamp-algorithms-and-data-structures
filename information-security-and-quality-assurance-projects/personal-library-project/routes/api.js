/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

//Setup database
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB);

//Setup Schema and Model for database
const Schema = mongoose.Schema;
const bookSchema = new Schema ({
  title: {type: String, required: true},
  comments: [String]
});
const Model = mongoose.model('Model', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //Response will be array of all book objects
      Model.find({}, (err, data) => {
        if (err) {
          console.log('Error in getting array of all books: ' + err);
        } else {
          res.json(data.map(book => {
            return {_id: book._id, title: book.title, commentcount: book.comments.length};
          }));
        }
      });
    })
    
    .post(function (req, res){
      const title = req.body.title;
      //If no title then res.json('missing title');
      if (title === '' || title === undefined) {
        return res.send('missing title');
      };
      //Add a book to the DB and returns an object with the title and _id
      const newBook = new Model({
        title: title,
        comments: []
      });
      newBook.save((err, data) => {
        if (err) {
          console.log('Database error when adding new book: ' + err);
        } else {
          console.log('New book saved: ' + title);
          res.json({_id: data._id, title: data.title, comments: data.comments});
        }
      });
    })
    
    .delete(function(req, res){
      //Deletes all books in the database
      Model.deleteMany({}, (err, data) => {
        if (err) {
          console.log('Error in deleting all books: ' + err);
        } else {
          res.json('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;
      //Gets a single book by _id
      Model.findById(bookid, (err, data) => { //Docs say pass id without object
        if (err) {
          console.log('Error in finding book by id: ' + err);
        } else if (data === null) {
          res.send('no book exists');
        } else {
          res.json({_id: data._id, title: data.title, comments: data.comments}); 
        }
      });
    })
    
    .post(function(req, res){
      const bookid = req.body.id;
      const comment = req.body.comment;
      //Find a book by _id and push a comment to comments
      const options = {new: true};
      Model.findByIdAndUpdate(bookid, {$push: {comments: comment}}, options, (err, data) => { //Docs say pass id without object
        if (err) {
          console.log('Error in finding and updating book by id: ' + err);
        } else if (data === null) {
          res.send('no book exists');
        } else {
          res.json({_id: data._id, title: data.title, comments: data.comments});
        }
      });
    })
    
    .delete(function(req, res){
      const bookid = req.params.id;
      //Find book by _id and delete
      Model.findByIdAndRemove(bookid, (err, data) => { //Docs say pass id without object
        if (err) {
          console.log('Error in deleting book by id: ' + err);
        } else if (data === null) {
          //If no book is found then it should return null
          res.send('no book exists');
        } else {
          console.log('Book deleted by id. Title: ' + data.title + '. ID: ' + data._id);
          res.json('delete successful');
        }
      });
    });
  
};
