/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var request = require('request');

//Setup database
mongoose.connect(process.env.DB);

//Setup Schema and Model for database
const Schema = mongoose.Schema;
const stockSchema = new Schema ({
  ticker: {type: String, required: true},
  likes: [String]
});
const Model = mongoose.model('Model', stockSchema);

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      //Get variables and setup data structures
      const userIP = req.headers['x-forwarded-for'].slice(0, req.headers['x-forwarded-for'].search(/,/));
      const hashedIP = bcrypt.hashSync(userIP, 12);
      const key = process.env.API_KEY;
      const liked = req.query.like || false;
      const stocks = req.query.stock;
      let stocksObj = null;
      let multiple = false;
      let result = {stockData: {}};
      if (Array.isArray(stocks)) {
        stocksObj = {};
        stocks[0] = stocks[0].toUpperCase();
        stocks[1] = stocks[1].toUpperCase();
        stocksObj[stocks[0]] = {stock: stocks[0]};
        stocksObj[stocks[1]] = {stock: stocks[1]};
        multiple = true;
        result = {stockData: []}
      };
    
      function getStockData(ticker, callback) {
        request(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${key}`, (err, response, body) => {
          if (err) {
            console.log('Error in API query: ' + err);
            //Return error if API doesn't recognize ticker
          } else if (JSON.parse(body)['Global Quote']['05. price'] === undefined) {
            res.json('Invalid ticker symbol submitted: ' + ticker);
          } else {
            //Callback with ticker then price
            callback(JSON.parse(body)['Global Quote']['01. symbol'], JSON.parse(body)['Global Quote']['05. price']);
          }
        });
      }; //Gives us ticker and price

      function getLikes(ticker, hashedIP, callback) {
        const options = {
          new: true, //Return the modified object rather than original
          upsert: true //Creates object if it doesn't exist
        };
        //If liked === true then findOneAndUpdate the data based on hashedIP in returned array
        if (liked) {
          Model.findOneAndUpdate({ticker: ticker}, {$addToSet: {likes: hashedIP}}, options, (err, data) => {
            //Check database for stock by ticker name
            //If it doesn't exist then create it by upsert default
            //If hashedIP isn't already in the likes array then add it
            //Get length of array
            //Callback with array length
            if (err) {
              console.log('Error: ' + err);
            } else {
              callback(ticker, data.likes.length);
            }
          });
        } else {
          Model.findOne({ticker: ticker}, (err, doc) => {
            //Check database for stock by ticker name
            //If it doesn't exist then return length of 0
            if (doc == undefined) {
              console.log('Ticker not in DB');
              callback(ticker, 0);
            } else {
              //Callback with array length
              callback(ticker, doc.likes.length);
            }
          });
        }
      }; //Gives us ticker and likes
    
      function stockCallback(stock, price) {
        if (multiple) {
          stocksObj[stock].price = price;
        } else {
          result.stockData.stock = stock;
          result.stockData.price = price;
        }
        
        if (multiple) {
          if (stocksObj[stocks[0]].price !== undefined && stocksObj[stocks[0]].likes !== undefined && stocksObj[stocks[1]].price !== undefined && stocksObj[stocks[1]].likes !== undefined) {
            result.stockData.push({stock: stocksObj[stocks[0]].stock, price: stocksObj[stocks[0]].price, rel_likes: stocksObj[stocks[0]].likes - stocksObj[stocks[1]].likes});
            result.stockData.push({stock: stocksObj[stocks[1]].stock, price: stocksObj[stocks[1]].price, rel_likes: stocksObj[stocks[1]].likes - stocksObj[stocks[0]].likes});
            res.json(result);
          }
        } else {
          if (result.stockData.stock !== undefined && result.stockData.price !== undefined && result.stockData.likes !== undefined) {
            res.json(result);
          }
        }
      };
    
      function likesCallback(stock, likes) {
        if (multiple) {
          stocksObj[stock].likes = likes;
        } else {
          result.stockData.likes = likes;
        }
        
        if (multiple) {
          if (stocksObj[stocks[0]].price !== undefined && stocksObj[stocks[0]].likes !== undefined && stocksObj[stocks[1]].price !== undefined && stocksObj[stocks[1]].likes !== undefined) {
            result.stockData.push({stock: stocksObj[stocks[0]].stock, price: stocksObj[stocks[0]].price, rel_likes: stocksObj[stocks[0]].likes - stocksObj[stocks[1]].likes});
            result.stockData.push({stock: stocksObj[stocks[1]].stock, price: stocksObj[stocks[1]].price, rel_likes: stocksObj[stocks[1]].likes - stocksObj[stocks[0]].likes});
            res.json(result);
          }
        } else {
          if (result.stockData.stock !== undefined && result.stockData.price !== undefined && result.stockData.likes !== undefined) {
            res.json(result);
          }
        }
      };
    
      if (multiple) {
        getStockData(stocks[0], stockCallback);
        getStockData(stocks[1], stockCallback);
        getLikes(stocks[0], hashedIP, likesCallback);
        getLikes(stocks[1], hashedIP, likesCallback);
      } else {
        getStockData(stocks, stockCallback);
        getLikes(stocks, hashedIP, likesCallback);
      };
    
    });
};
