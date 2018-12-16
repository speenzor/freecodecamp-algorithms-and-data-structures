/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testid = '5c16932bf3cbfd22f2fb1a31';

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'The Adventures of Huckleberry Finn'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'The Adventures of Huckleberry Finn', 'Title should match');
            assert.isArray(res.body.comments);
            assert.property(res.body, '_id', 'Should have unique id');
            assert.property(res.body, 'title', 'Should have a title in response');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Response should be an array');
            assert.property(res.body[0], 'title', 'Books in array should contain titles');
            assert.property(res.body[0], '_id', 'Books should have ids');
            assert.property(res.body[0], 'commentcount', 'Books should each have a commentcount');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/as123l45l27k')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'Invalid ID should notify that no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
            .get('/api/books/' + testid)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'comments', 'Response should contain comments array');
              assert.isArray(res.body.comments, 'Response should have a comment array');
              assert.property(res.body, 'title', 'Response should have a title property');
              assert.property(res.body, '_id', 'Response should have an _id');
              assert.equal(res.body._id, testid);
              done();
            });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testid)
          .send({comment: 'Test comment'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            console.log(res);
            assert.property(res.body, 'comments', 'Response should contain comments');
            assert.property(res.body, 'title', 'Response should have a title property');
            assert.property(res.body, '_id', 'Response should have an _id');
            assert.isArray(res.body.comments, 'Response should have a comment array');
            assert.include(res.body.comments, 'Test comment', 'Response comments should contain the test comment');
            done();
          });
      });
      
    });

  });

});
