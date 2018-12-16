/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.approximately(Number(res.body.stockData.price), 1000, 100); //Adjust here
          assert.approximately(res.body.stockData.likes, 0, 10); //Adjust here
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'aapl', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "AAPL");
            assert.approximately(Number(res.body.stockData.price), 160, 50); //Adjust here
            assert.approximately(res.body.stockData.likes, 0, 10); //Adjust here
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'aapl', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "AAPL");
            assert.approximately(Number(res.body.stockData.price), 160, 50); //Adjust here
            assert.approximately(res.body.stockData.likes, 0, 10); //Adjust here
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['aapl', 'goog']})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].stock, "AAPL");
            assert.equal(res.body.stockData[1].stock, "GOOG");
            assert.approximately(Number(res.body.stockData[0].price), 160, 50); //Adjust here
            assert.approximately(Number(res.body.stockData[1].price), 1000, 100); //Adjust here
            assert.approximately(res.body.stockData[0].rel_likes, 0, 10); //Adjust here
            assert.approximately(res.body.stockData[1].rel_likes, 0, 10); //Adjust here
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['fb', 'snap'], like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].stock, "FB");
            assert.equal(res.body.stockData[1].stock, "SNAP");
            assert.approximately(Number(res.body.stockData[0].price), 140, 40); //Adjust here
            assert.approximately(Number(res.body.stockData[1].price), 6, 5); //Adjust here
            assert.approximately(res.body.stockData[0].rel_likes, 0, 10); //Adjust here
            assert.approximately(res.body.stockData[1].rel_likes, 0, 10); //Adjust here
          done();
        });
      });
      
    });
});
