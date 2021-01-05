const mysql = require('mysql');
const db = require('../db.js');
const connection = mysql.createConnection(db);

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    var result_json = {success: true};

    connection.query("SELECT * from chart", (error, result) => {
        if (error) {
            console.log("error: err");
            result_json.success = false;
            result_json.err = err;    
            return;
        }

        console.log(result);
        result_json['data'] = result;
    });

    res.json(result_json);
})

module.exports = router;