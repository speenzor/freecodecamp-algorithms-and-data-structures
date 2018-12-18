/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

//MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB);

//Setup Schema and Model for database
const Schema = mongoose.Schema;
const issueSchema = new Schema ({
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String,
  project: {type: Schema.Types.ObjectId, ref: 'projectModel'}
});
const projectSchema = new Schema ({
  project: String,
  issues: [{type: Schema.Types.ObjectId, ref: 'issueModel'}]
});
const projectModel = mongoose.model('projectModel', projectSchema);
const issueModel = mongoose.model('issueModel', issueSchema);


module.exports = function (app) {
  
  app.route('/api/projects/')
    .get(function (req, res) {
      projectModel.find({}, function(err, data) {
        if (err) {
          console.log('Error in getting list of all projects: ' + err);
        } else {
          console.log('Project finding operation successful');
          res.send(data);
        }
      });
    })

    .post(function (req, res) {
      const project = req.body.project_name;
      const newProject = new projectModel ({
        project: project,
        issues: []
      });
      newProject.save(function (err, data) {
        if (err) {
          console.log('Error saving new project: ' + err);
        } else {
          console.log('New project saved');
          res.json(data);
        }
      });
    })
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const query = req.query;
      //Gets an array of all issues for the given project with optional filters
      projectModel.find({project: project}, (err, data) => {
        console.log('Data from first get: ' + data);
        if (err) {
          console.log('Error in getting array of seached issues: ' + err);
        } else {
          query.project = data._id;
          issueModel.find(query, (err, data) => {
            console.log('Sending data from issueModel query');
            res.send(data); //res.send([{}, {}, ...]);
          });
        }
      });
    })
    
    .post(function (req, res){
      const project = req.params.project;
      const issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
      };
      //Saves a new issue to the DB under that project
      if (issue.issue_title === undefined || issue.issue_text === undefined || issue.created_by === undefined) {
        res.send('missing inputs');
      } else {
        projectModel.find({project: project}, function(err, data) {
          if (err) {
            console.log('Error in finding project for issue POST: ' + err);
          } else {
            issue.project = data._id;
            const newIssue = new issueModel(issue);
            newIssue.save(function(err, data) {
              if (err) {
                console.log('Error in saving new issue: ' + err);
              } else {
                console.log('New issue saved');
                res.json(data);
              }
            });
          }
        });
      }
    })
    
    .put(function (req, res){
      const project = req.params.project;
      const id = req.body._id;
      const update = {
        updated_on: new Date(),
        open: !req.body.open //Form defaults to false. Then flip to true, meaning no change. If the box is checked it will close the issue
      };
      function addToUpdateObject (input) {
        for (var property in input) {
          if (input[property] !== undefined && property !== '_id' && property !== 'updated_on' && property !== 'open') {
            update[property] = input[property];
          }
        }
      };
      addToUpdateObject(req.body);
      const options = {
        new: true //returns the modified document
      };
      //Find issue in given project and update based on parameters
      if (update.issue_title === undefined && update.issue_text === undefined && update.created_by === undefined && update.assigned_to === undefined && update.status_text === undefined && update.open === true) {
        //If no fields are updated
        res.send('no updated field sent');
      } else {
        projectModel.find({project: project}, function(err, data) {
          if (err) {
            console.log('Error in finding project: ' + err);
            res.send('could not update ' + id);
          } else {
            issueModel.findByIdAndUpdate(id, update, options, function(err, data) {
              if (err) {
                console.log('Error in finding issue to update: ' + err);
                res.send('could not update ' + id);
              } else {
                console.log('New issue after being updated: \n' + data);
                res.send('successfully updated');
              }
            });
          }
        }); 
      }
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      console.log('body request: ' + JSON.stringify(req.body));
      const issueToDelete = {
        _id: req.body._id
      };
      if (issueToDelete._id === undefined) {
        res.send('_id error');
      } else {
        projectModel.find({project: project}, function(err, data) {
          if (err) {
            console.log('Error finding project: ' + err);
          } else {
            issueToDelete.project = data._id;
            issueModel.findOneAndDelete(issueToDelete, function(err, data) {
              if (err) {
                console.log('Error finding and deleteing issue: ' + err);
                res.send('could not delete ' + issueToDelete._id);
              } else {
                console.log('Issue deletion successful');
                res.send('deleted ' + data._id);
              }
            });
          }
        });
      }
    });
    
};
