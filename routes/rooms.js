var express = require('express');
var router = express.Router();

const { v4: uudiV4 } = require('uuid')

router.get('/', (req, res) => {
    res.redirect(`/${uudiV4()}`)
})

router.get('/:room', (req, res) => {
    console.log("roomId!");
    res.render('room', {roomId: req.params.room});
})
// router.get('/:room', (req, res) => {
//     res.render('room.html', {roomId: req.params.room});
// })

module.exports = router;