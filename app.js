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
    res.send('[Server] registrarse');
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


//
//
// app.get('/index.html', function (req, res) {
//     res.sendFile( __dirname + "/" + "index.html" );
// })
//
// app.post('/process_post', urlencodedParser, function (req, res) {
//
//     // Prepare output in JSON format
//     response = {
//         first_name:req.body.first_name,
//         last_name:req.body.last_name
//     };
//     console.log(response);
//     res.end(JSON.stringify(response));
// })