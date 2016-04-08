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

//listen
studentApp.listen(8002, function () {
    console.log('Alumno professorApp listening on port 8082!');
});


var questions = [];

//call every 10 seconds
setInterval(function () {
    request.post(
            'http://localhost:8081/preguntar',
        { form: {
            titulo: 'Titulo test' + Math.floor(Math.random()*10),
            mensaje: 'Mensaje test' + Math.floor(Math.random()*10),
            sender: 8002
        }
        },
        function (error, response, body){
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
},10000)

studentApp.post('/recibir', function (req, res) {
    questions.push(req.body);
    console.log(questions);
    res.send('ok');
})


