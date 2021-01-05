const express = require('express');
const formidable = require('formidable');
const awssdk = require('aws-sdk');
const fs = require('fs');

const mysql = require('mysql');
const db = require('./db.js');
const connection = mysql.createConnection(db);

const app = express();
const s3 = new awssdk.S3();

app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/script', express.static(__dirname + '/script'));
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

var indexRouter = require('./routes/index');
var rommsRouter = require('./routes/rooms');
var byeRouter = require('./routes/bye');
var chartRouter = require('./api/chart');

app.use('/', indexRouter);
app.use('/room', rommsRouter);
app.use('/bye', byeRouter);
app.use('/api/chart', chartRouter);

app.get('/video', (req, res) => {
    connection.query("SELECT link from chart where chartrank="+ req.query.rank, (error, result) => {
        res.send(result);
    })
});

app.get('/chart', (req, res) => {
    connection.query("SELECT * from chart", (error, result) => {
        res.json(result);
    })
});

app.post('/post', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        const params = {
            Bucket: 'oasismine',
            Key: files.file.name,
            Body: fs.createReadStream(files.file.path)
        }
        s3.upload(params, function (error, data) {
            if (error)
                res.send("Fail");
            else
                res.send(data.Location);
        })
    })
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});

