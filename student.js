/**
 * Created by Ignacio on 3/29/16.
 */

//imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
//creates student server
var studentApp = express();
studentApp.use(bodyParser.urlencoded({ extended: false }));

var prompt = require('prompt');

var requestPromise = require('request-promise');

var questions = [];
var port;

prompt.start();

prompt.get(['port'], function (err, result) {
    if (err || !result.port) { return 1; }
    port = result.port;
    listening()
});



function listening() {
    //listen
    studentApp.listen(port, function () {
        console.log('Alumno listening on port '+port);
    });

    setInterval(function () {
        ask();
    },10000);
}

function ask() {
    console.log('asking..');
    var options = {
        method:'POST',
        uri:'http://localhost:8081/preguntar',
        form:{
            titulo: 'Titulo test' + Math.floor(Math.random()*10),
            mensaje: 'Mensaje test' + Math.floor(Math.random()*10),
            sender: port
        }
    };

    requestPromise(options)
        .then(function (result) {
            //succeeded
            console.log('succeeded!!')
        })
        .catch(function (err) {
            //post failed
            console.log(err);
        });
}



studentApp.post('/recibir', function (req, res) {
    questions.push(req.body);
    console.log(questions);
    res.send('ok');
})


