/**
 * Created by Ignacio on 3/29/16.
 */


var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/recibir', function (req, res) {
    
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

app.post('/recibirRespuesta', function (req, res) {
    console.log(req.body);
    res.send('ok');
})


app.listen(8003, function () {
    console.log('Profesor app listening on port 8083!');
});
