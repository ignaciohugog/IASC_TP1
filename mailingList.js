/**
 * Created by Ignacio on 3/29/16.
 */
/**
 * Created by Ignacio on 3/29/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var alumnos = [];
var profesores = [];
var preguntas = [];

app.use(bodyParser.urlencoded({ extended: false }));


var request = require('request');


//listening
app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});

app.post('/preguntar', function (req, res) {
    var pregunta = {
        titulo: req.body.titulo,
        mensaje: req.body.mensaje,
        alumno: req.body.sender,
        id: preguntas.length
    };

    preguntas.push(pregunta);

    if (alumnos.indexOf(req.body.sender)===-1){
        alumnos.push(req.body.sender);
    }

    notificar(pregunta, alumnos.concat(profesores));

    res.send('[Server] preguntar');
});

app.post('/answering', function (req, res) {

    // var pregunta = {
    //     mensaje: req.body.id,
    //     alumno: req.body.sender,
    // };

    //notificar(pregunta, alumnos.concat(profesores));
});

app.post('/responder', function (req, res) {

    notificar(req.body, alumnos);
    notificarRespuesta(req.body)
    res.send('[Server] Responder ok');
});

function notificarRespuesta(respuesta){

    profesores.forEach(function (notificado) {
        request.post(
            'http://localhost:'+notificado+'/recibirRespuesta',
            { form: {
                titulo: respuesta.titulo,
                mensaje: respuesta.mensaje,
                sender: respuesta.sender,
                id:respuesta.id
            }
            },
            function (error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
    })
}


app.post('/registrarse', function (req, res) {

    if (profesores.indexOf(req.body.sender)===-1){
        profesores.push(req.body.sender);
    }
    console.log(profesores);
    res.send('profesor registrado ID: '+req.body.sender);
});

function notificar (pregunta, notificados) {

    notificados.forEach(function (notificado) {
        request.post(
            'http://localhost:'+notificado+'/recibir',
            { form: {
                titulo: pregunta.titulo,
                mensaje: pregunta.mensaje,
                sender: pregunta.sender,
                id:pregunta.id
            }
            },
            function (error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
    })
}
