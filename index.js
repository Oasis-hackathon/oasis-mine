const express = require('express');
const formidable = require('formidable');
const awssdk = require('aws-sdk');
const fs = require('fs');

const mysql = require('mysql');
const db = require('./db.js');
const connection = mysql.createConnection(db);

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const s3 = new awssdk.S3();
const { v4: uudiV4 } = require('uuid')

app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/script', express.static(__dirname + '/script'));
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

var indexRouter = require('./routes/index');
var roomsRouter = require('./routes/rooms');
var byeRouter = require('./routes/bye');

app.get('/chart', (req, res) => {
    connection.query("SELECT * from chart", (error, result) => {
        res.json(result);
    })
});

app.use('/', indexRouter);
// app.use('/room', roomsRouter);
app.use('/bye', byeRouter);

app.get('/room', (req, res) => {
    res.redirect(`/${uudiV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})

server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});


