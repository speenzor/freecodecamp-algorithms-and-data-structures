/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  const testBoardName = 'general';
  const testDeletePassword = 'password';
  let testThreadId1 = '5c1a85ff0e01443d79390888'; //To be deleted
  let testThreadId2 = '5c1a7a47fd2e121fd07ae295'; //Won't be deleted
  let testReplyId1 = '5c1a7afad7ddfe2038feeba1'; //Won't be deleted
  let testThreadId3 = '5c1a8616aa81243db6e5817d'; //To be deleted in last DELETE tests
  let testReplyId2 = '5c1a7b1cea1c88206e0e0728'; //To be deleted in last DELETE tests
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST a new thread => ', function() {
      test('Post to valid board', function(done) {
        chai.request(server)
          .post('/api/threads/' + testBoardName)
          .send({
            text: 'Testing new thread',
            delete_password: testDeletePassword
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res).to.redirect; //test for redirect to '/b/${board}/'
            done();
          });
      });
      
    });
    
    suite('GET array of 10 most recently bumped threads => ', function() {
      test('Valid board get request', function(done) {
        chai.request(server)
          .get('/api/threads/' + testBoardName)
          .query({}) //Nothing to send
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'replies');
            assert.isArray(res.body[0].replies);
            done();
          });
      });
      
      
    });
    
    suite('DELETE thread and its related replies => ', function() {
      test('Correct password', function(done) {
        chai.request(server)
          .delete('/api/threads/' + testBoardName)
          .send({
            thread_id: testThreadId1, //Need to get a thread_id
            delete_password: testDeletePassword
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
      
      test('Incorrect password', function(done) {
        chai.request(server)
          .delete('/api/threads/' + testBoardName)
          .send({
            thread_id: testThreadId2, //Need a test thread_id
            delete_password: 'wrongpassword'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      
    });
    
    suite('PUT report on a thread => ', function() {
      test('Successful report', function(done) {
        chai.request(server)
          .put('/api/threads/' + testBoardName)
          .send({
            thread_id: testThreadId2 //Need test thread
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'reported');
            done();
          });
      });
      
      test('Invalid thread_id', function(done) {
        chai.request(server)
          .put('/api/threads/' + testBoardName)
          .send({
            board: testBoardName,
            thread_id: 'Wrongthread'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'invalid thread_id');
            done();
          });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Post a new reply to a thread', function(done) {
        chai.request(server)
          .post('/api/replies/' + testBoardName)
          .send({
            text: 'Testing new reply',
            delete_password: testDeletePassword,
            thread_id: testThreadId2 //Get thread to test
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res).to.redirect; //test for redirect to '/b/${board}/${thread_id}/'
            done();
          });
      });
      
    });
    
    suite('GET a thread with all of its replies => ', function() {
      test('No thread_id in query', function(done) {
        chai.request(server)
          .get('/api/replies/' + testBoardName)
          .query({}) //Nothing to send
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no thread_id specified');
            done();
          });
      });
      
      test('Valid thread_id', function(done) {
        chai.request(server)
          .get('/api/replies/' + testBoardName)
          .query({
            thread_id: testThreadId2 //Need a thread_id to test
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'bumped_on');
            assert.property(res.body, 'replies');
            assert.isArray(res.body.replies);
            done();
          });
      });
      
    });
    
    suite('PUT report a reply on a thread => ', function() {
      test('Successful report', function(done) {
        chai.request(server)
          .put('/api/replies/' + testBoardName)
          .send({
            thread_id: testThreadId2, //Need a test thread
            reply_id: testReplyId1 //Need a test reply
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'reported');
            done();
          });
      });
      
      test('Invalid thread_id', function(done) {
        chai.request(server)
          .put('/api/replies/' + testBoardName)
          .send({
            board: testBoardName,
            thread_id: 'wrongthread',
            reply_id: 'doesntmatter'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'invalid thread_id');
            done();
          });
      });
      
      test('Invalid reply_id', function(done) {
        chai.request(server)
          .put('/api/replies/' + testBoardName)
          .send({
            board: testBoardName,
            thread_id: testThreadId2, //Need a valid thread id
            reply_id: 'wrongreply'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'invalid reply_id');
            done();
          });
      });
      
    });
    
    suite('DELETE to change the text of reply to [deleted]', function() {
      test('Valid thread_id and reply_id', function(done) {
        chai.request(server)
          .delete('/api/replies/' + testBoardName)
          .send({
            thread_id: testThreadId3, //To be deleted
            reply_id: testReplyId2, //To be deleted
            delete_password: testDeletePassword
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
      
      test('No thread_id', function(done) {
        chai.request(server)
          .delete('/api/replies/' + testBoardName)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no thread_id specified');
            done();
          });
      });
      
      test('No reply_id', function(done) {
        chai.request(server)
          .delete('/api/replies/' + testBoardName)
          .send({
            thread_id: testThreadId2 //Wont get deleted
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no reply_id specified');
            done();
          });
      });
      
      test('No delete_password', function(done) {
        chai.request(server)
          .delete('/api/replies/' + testBoardName)
          .send({
            thread_id: testThreadId2, //Wont get deleted
            reply_id: testReplyId1, //Wont get deleted
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no delete_password specified');
            done();
          });
      });
      
      test('Incorrect password', function(done) {
        chai.request(server)
          .delete('/api/replies/' + testBoardName)
          .send({
            thread_id: testThreadId2, //Wont get deleted
            reply_id: testReplyId1, //Wont get deleted
            delete_password: 'wrongpassword'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      
    });
    
  });

});
