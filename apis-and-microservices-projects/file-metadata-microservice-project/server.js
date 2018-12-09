'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');

var app = express();
var upload = multer();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.post('/api/fileanalyse', upload.any(), (req, res) => {
  console.log('File posted.');
  console.log(req.files);
  const name = req.files[0].originalname;
  const type = req.files[0].mimetype;
  const size = req.files[0].size;
  res.json({name: name, type: type, size: size});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
