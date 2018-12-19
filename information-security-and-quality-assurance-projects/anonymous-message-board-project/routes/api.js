/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

const Schema = mongoose.Schema;
const replySchema = new Schema ({
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: Date,
  reported: Boolean,
  thread: {type: Schema.Types.ObjectId, ref: 'threadModel'}
});
const threadSchema = new Schema ({
  text: String,
  delete_password: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [{type: Schema.Types.ObjectId, ref: 'replyModel'}],
  board: {type: Schema.Types.ObjectId, ref: 'boardModel'}
});
const boardSchema = new Schema ({
  board: String,
  threads: [{type: Schema.Types.ObjectId, ref: 'threadModel'}]
});
const boardModel = mongoose.model('boardModel', boardSchema);
const threadModel = mongoose.model('threadModel', threadSchema);
const replyModel = mongoose.model('replyModel', replySchema);

module.exports = function (app) {
  
  app.route('/api/boards/')
    .post(function (req, res) {
      const board_name = req.body.board_name;
      const newBoard = new boardModel ({
        board: board_name,
        threads: []
      });
      newBoard.save(function (err, data) {
        if (err instanceof Error) {
          console.log('Error creating new board: ' + err);
        } else {
          console.log('New board created');
          res.json(data);
        }
      });
   });
  
  app.route('/api/threads/:board')
    .get(function (req, res) {
      //Get an array of the 10 most recent bumped threads from board
      const board = req.params.board;
      if (board === undefined || board === '') {
        res.send('board undefined');
      } else {
        //Model find board
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for thread GET op: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            console.log('Board not found');
            res.send('invalid board');
          } else {
            //Get all the threads that have a board value equal to the board's id
            threadModel.find({board: data._id}, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in getting array of threads: ' + err);
                res.send('No threads found for this board');
              } else if (data === null) {
                console.log('No threads found');
                res.send('No threads found for this board');
              } else {
                const allThreads = data; //Get array of all threads
                //Sort threads by date bumped
                const sortedThreads = allThreads.sort((a, b) => {
                  a = a.bumped_on;
                  b = b.bumped_on;
                  return a > b ? -1 : a < b ? 1 : 0;
                });
                //Get slice of array from 0 to 9
                const recentlyBumpedThreads = sortedThreads.slice(0, 9);
                //Within each of the 10 threads sort the replies array by created_on date
                const sortedReplies = recentlyBumpedThreads.map(thread => {
                  const replies = thread.replies;
                  replies.sort((a, b) => {
                    a = a.created_on;
                    b = b.created_on;
                    return a > b ? -1 : a < b ? 1 : 0;
                  });
                  //Only keep the 3 most recent replies
                  const filteredReplies = replies.slice(0,2);
                  thread.replies = filteredReplies;
                  return thread;
                });
                const response = sortedReplies.map(thread => {
                  const result = {
                    _id: thread._id,
                    text: thread.text,
                    created_on: thread.created_on,
                    bumped_on: thread.bumped_on,
                    replies: thread.replies
                  };
                  return result;
                });
                res.json(response);
              }
            });
          }
        }); 
      }
    })
    
    .post(function (req, res) {
      //Post a new thread
      const board = req.params.board;
      const thread = {
        text: req.body.text,
        delete_password: req.body.delete_password,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        replies: []
      };
      if (board === undefined || thread.text === undefined || thread.delete_password === undefined) {
        res.send('missing required inputs');
      } else {
        boardModel.find({board: board}, function(err, data) {
          if (err instanceof Error) {
            console.log('Error in finding board for thread post: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            res.send('invalid board');
          } else {
            //Add the board ID to the thread object
            thread.board = data.id;
            const newThread = new threadModel (thread);
            newThread.save(function(err, data) {
              if (err instanceof Error) {
                console.log('Error in saving new thread: ' + err);
              } else {
                console.log('New thread saved');
                console.log('Data: ' + data);
                res.redirect(`/b/${board}/`);
              }
            });
          }
        });
      }
    })
  
    .put(function (req, res) {
      //Report thread
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      console.log('board: ' + board);
      console.log('thread_id: ' + thread_id);
      //Logic to handle undefined inputs
      if (board === undefined || thread_id === undefined) {
        res.send('invalid input');
      } else {
        //Find board
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for thread reporting: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            console.log('Board not found');
            res.send('invalid board');
          } else {
            //Somehow incorporate the board here?
            const options = {new: true}; //Returns modified document
            threadModel.findOneAndUpdate({_id: thread_id}, {reported: true}, options, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in finding thread for thread reporting: ' + err);
                res.send('invalid thread_id');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('invalid thread_id');
              } else {
                //Update thread's "reported" to true
                console.log('Thread reported. Updated thread: ' + data);
                res.send('reported');
              }
            });
          }
        });
      }
    })
    
    .delete(function (req, res) {
      //Delete an entire thread with all replies given thread_id and delete_password
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const delete_password = req.body.delete_password;
      if (thread_id === undefined) {
        res.send('no thread_id specified');
      } else if (delete_password === undefined) {
        res.send('no delete_password specified');
      } else if (board === undefined) {
        res.send('no board specified');
      } else {
        //Find board
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for thread deletion: ' + err);
            res.send('board not found');
          } else if (data === null) {
            console.log('Board not found');
            res.send('board not found');
          } else {
            //If not validation then do threadModel.find, then match, if matches then threadModel.findByIdAndDelete
            threadModel.findOne({_id: thread_id}, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in finding thread for deletion: ' + err);
                res.send('thread not found');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('thread not found');
              } else if (data.delete_password !== delete_password) {
                res.send('incorrect password');
              } else {
                threadModel.findOneAndDelete({_id: data._id}, (err, data) => {
                  if (err instanceof Error) {
                    console.log('Error in deleting thread: ' + err);
                  } else if (data === null) {
                    console.log('Something wrong with findOneAndDelete');
                  } else {
                    res.send('success');
                  }
                });
              }
            });
          }
        });
      }
    })
  
  
  app.route('/api/replies/:board')
    .get(function (req, res) {
      //Get a thread with all of its replies
      const board = req.params.board;
      const thread_id = req.query.thread_id;
      if (thread_id === undefined || thread_id === 'undefined') {
        res.send('no thread_id specified');
      } else if (board === undefined) {
        res.send('no board specified');
      } else {
        //Find board in DB
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for getting a thread: ' + err);
            res.send('board not found');
          } else if (data === null) {
            console.log('Board not found');
            res.send('board not found');
          } else {
            //Include the returned board's _id in the search query for the thread
            threadModel.findOne({_id: thread_id, board: data._id}, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in finding thread by ID for getting thread: ' + err);
                res.send('invalid thread');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('invalid thread');
              } else {
                //console.log('Thread found: ' + data);
                const threadData = data;
                replyModel.find({thread: threadData._id}, (err, data) => {
                  if (err instanceof Error) {
                    console.log('Error in finding replies: ' + err);
                  } else if (data === null) {
                    console.log('Error, cannot find replies');
                  } else {
                    threadData.replies = data;
                    threadData.replies = threadData.replies.map(reply => {
                      return {_id: reply._id, text: reply.text, created_on: reply.created_on, thread: reply.thread}
                    });
                    const result = {_id: threadData._id, text: threadData.text, created_on: threadData.created_on, bumped_on: threadData.bumped_on, replies: threadData.replies};
                    res.json(result);
                    //Should be: res.json({text: '', created_on: Date, bumped_on: Date, replies: []});
                  }
                });
              }
            });
          }
        });
      }
    })
    
    .post(function (req, res) {
      //Post a reply to a thread on a board
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const bumped_on = new Date(); //To update the thread's bumped_on
      const reply = {
        text: req.body.text,
        delete_password: req.body.delete_password,
        created_on: new Date(),
        reported: false
      };
      //Logic to check for undefined values in input. What is required?
      if (board === undefined || thread_id === undefined || reply.text === undefined || reply.delete_password === undefined) {
        res.send('invalid input');
      } else {
        //Find board in DB
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for posting a reply: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            console.log('Invalid board');
            res.send('invalid board');
          } else {
            const options = {new: true}; //Add options
            //Update the thread's bumped_on date
            threadModel.findOneAndUpdate({_id: thread_id, board: data._id}, {bumped_on: bumped_on}, options, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in finding thread to post a reply: ' + err);
                res.send('invalid thread');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('invalid thread');
              } else {
                //Add thread's id to the reply object
                reply.thread = data._id;
                const newReply = new replyModel(reply); //Create new reply with reply object
                newReply.save((err, data) => {
                  if (err instanceof Error) {
                    console.log('Error in saving new reply: ' + err);
                  } else {
                    console.log('New reply saved: ' + data);
                    res.redirect(`/b/${board}/${thread_id}/`);
                  }
                });
              }
            });
          }
        });
      }
    })
  
    .put(function (req, res) {
      //Report a reply on a thread
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      //Logic to check for undefined values in input. What is required?
      if (board === undefined || thread_id === undefined || reply_id === undefined) {
        res.send('required inputs not specified');
      } else {
        //Find board in DB
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board for posting a reply: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            console.log('Board not found');
            res.send('invalid board');
          } else {
            //Find thread by thread_id and board's id
            threadModel.find({_id: thread_id, board: data._id}, (err, data) => {
              if (err instanceof Error) {
                console.log('Error finding thread to report a reply: ' + err);
                res.send('invalid thread_id');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('invalid thread_id');
              } else {
                //Find reply by reply_id and thread's returned id
                const options = {new: true}; //returns modified document in data
                replyModel.findOneAndUpdate({_id: reply_id}, {reported: true}, options, (err, data) => {
                  if (err instanceof Error) {
                    console.log('Error in finding reply to report: ' + err);
                    res.send('invalid reply_id');
                  } else if (data === null) {
                    console.log('Reply not found');
                    res.send('invalid reply_id');
                  } else {
                    console.log('Reply reported. "reported" should show true: ' + data);
                    res.send('reported');
                  }
                });
              }
            });
          }
        });
      }
    })
    
    .delete(function (req, res) {
      //Change text of reply to '[deleted]'
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      const delete_password = req.body.delete_password;
      if (thread_id === undefined) {
        res.send('no thread_id specified');
      } else if (reply_id === undefined) {
        res.send('no reply_id specified');
      } else if (delete_password === undefined) {
        res.send('no delete_password specified');
      } else {
        //Check database for board
        boardModel.find({board: board}, (err, data) => {
          if (err instanceof Error) {
            console.log('Error in finding board to delete reply: ' + err);
            res.send('invalid board');
          } else if (data === null) {
            console.log('Board not found');
            res.send('invalid board');
          } else {
            threadModel.find({_id: thread_id, board: data._id}, (err, data) => {
              if (err instanceof Error) {
                console.log('Error in finding thread to delete reply: ' + err);
                res.send('invalid thread_id');
              } else if (data === null) {
                console.log('Thread not found');
                res.send('invalid thread_id');
              } else {
                replyModel.findOne({_id: reply_id}, (err, data) => {
                  if (err instanceof Error) {
                    console.log('Error in finding reply to delete: ' + err);
                    res.send('invalid reply_id');
                  } else if (data === null) {
                    console.log('Invalid reply_id');
                    res.send('invalid reply_id');
                  } else if (data.delete_password !== delete_password) {
                    res.send('incorrect password');
                  } else {
                    replyModel.findOneAndUpdate({_id: data._id}, {text: '[deleted]'}, {new: true}, (err, data) => {
                      if (err instanceof Error) {
                        console.log('Error in updating text in reply: ' + err);
                      } else if (data === null) {
                        console.log('Could not find reply after finding once for update');
                      } else {
                        res.send('success');
                      }
                    });
                  }
                });
              }
            });
          }
        });
    }
  })
};