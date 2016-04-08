/**
 * Created by Ignacio on 3/29/16.
 */

//imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

//creates professor server
var professorApp = express();
professorApp.use(bodyParser.urlencoded({ extended: false }));

//listen
professorApp.listen(8003, function () {
    console.log('Proffesor listening on port 8083!');
});

request.post(
    'http://localhost:8081/registrarse',
    { form: {
        sender: 8003
    }
    },
    function (error, response, body){
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);

professorApp.post('/recibir', function (req, res) {
    
    var pregunta = req.body;
    request.post(
        'http://localhost:8081/responder',
        { form: {
            sender: 8003,
            mensaje:'Respuesta test a pregunta '+pregunta.id,
            titulo: 'Respuesta test a pregunta '+ pregunta.id,
            id:pregunta.id
        }
        },
        function (error, response, body){
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
    res.send('ok');
})

professorApp.post('/recibirRespuesta', function (req, res) {
    console.log(req.body);
    res.send('ok');
})



