/**
 * Created by Ignacio on 3/29/16.
 */

//imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

//create mailingList server
var mailingList = express();

//holds data
var students = [];
var proffesors = [];
var questions = [];

//listen
mailingList.listen(8081, function () {
    console.log('mailingList listening on port 8081!');
});

mailingList.post('/preguntar', function (req, res) {
    var pregunta = {
        titulo: req.body.titulo,
        mensaje: req.body.mensaje,
        alumno: req.body.sender,
        id: questions.length
    };

    questions.push(pregunta);

    if (students.indexOf(req.body.sender)===-1){
        students.push(req.body.sender);
    }

    notificar(pregunta, students.concat(proffesors));

    res.send('[Server] preguntar');
});

mailingList.post('/responder', function (req, res) {

    notificar(req.body, students);
    notificarRespuesta(req.body)
    res.send('[Server] Responder ok');
});

function notificarRespuesta(respuesta){
    
        proffesors.forEach(function (notificado) {
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


mailingList.post('/registrarse', function (req, res) {

    if (proffesors.indexOf(req.body.sender)===-1){
        proffesors.push(req.body.sender);
    }
    console.log(proffesors);
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
// professorApp.get('/index.html', function (req, res) {
//     res.sendFile( __dirname + "/" + "index.html" );
// })
//
// professorApp.post('/process_post', urlencodedParser, function (req, res) {
//
//     // Prepare output in JSON format
//     response = {
//         first_name:req.body.first_name,
//         last_name:req.body.last_name
//     };
//     console.log(response);
//     res.end(JSON.stringify(response));
// })