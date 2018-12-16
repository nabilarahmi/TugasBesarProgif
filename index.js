const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "progifaye"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req, res) {
    res.send("Hello world\n");
});

// Get location coordinate.
app.get('/location_coordinate', function(req,res) {
    con.query("SELECT latitude,longitude FROM location_coordinate WHERE name= " + con.escape(req.query.name), function (err, result) {
        if (err) throw err;
        console.log(result);
        if (!result[0]) {
            return res.status(404).json({
                message: 'Record not found'
            });
        }
        return res.send(result[0]);
    });
});
//Get saved location address
app.get('/address', function(req,res) {
    con.query("SELECT address FROM saved_places WHERE name= " + con.escape(req.query.name), function (err, result) {
        if (err) throw err;
        console.log(result);
        if (!result[0]) {
            return res.status(404).json({
                message: 'Record not found'
            });
        }
        return res.send(result[0]);

    });
});

app.post('/insert_address', function(req,res){
    console.log(req.body);
    con.query("INSERT INTO saved_places (name,address) VALUES (" + con.escape(req.body.name) + "," + con.escape(req.body.address)+")", function(err, result) {
        if (err) return res.status(500).json({
            message: err.sqlMessage
        });
        return res.json({
            message: 'Insert successful'
        });
    });
})

app.listen(3000, function() {
    console.log("Listening on port 3000");
});