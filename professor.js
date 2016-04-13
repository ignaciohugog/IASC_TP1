/**
 * Created by Ignacio on 3/29/16.
 */

//imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var requestPromise = require('request-promise');
var prompt = require('prompt');

//creates professor server
var professorApp = express();
professorApp.use(bodyParser.urlencoded({ extended: false }));

var port;

prompt.start();

prompt.get(['port'], function (err, result) {
    if (err || !result.port) { return 1; }
    port = result.port;
    listening()
});


function listening() {
    //listen
    professorApp.listen(port, function () {
        console.log('Proffesor listening on port '+port);
    });
    registrarse();
    listeners();
}

function listeners() {
    professorApp.post('/recibir', function (req, res) {
        var pregunta = req.body;
        
        answering(pregunta)
        setTimeout(function() {
            responder(pregunta);

        }, 1000 + Math.random()*4000);
        
        
        res.send('ok');
    })

    professorApp.post('/recibirRespuesta', function (req, res) {
        console.log(req.body);
        res.send('ok');
    })

}

function answering(pregunta) {
    var options = {
        method:'POST',
        uri:'http://localhost:8081/answering',
        form:{
            sender: port,
            id:pregunta.id
        }
    };

    requestPromise(options)
        .then(function (result) {
            //succeeded
            console.log(result)
        })
        .catch(function (err) {
            //post failed
            console.log(err);
        });
    
}

function registrarse() {
    console.log('registrando profesor..');
    var options = {
        method:'POST',
        uri:'http://localhost:8081/registrarse',
        form:{
            sender: port
        }
    };

    requestPromise(options)
        .then(function (result) {
            //succeeded
            console.log(result)
        })
        .catch(function (err) {
            //post failed
            console.log(err);
        });
}

function responder(pregunta) {
    console.log('respondiendo..');
    var options = {
        method:'POST',
        uri:'http://localhost:8081/responder',
        form:{
            sender: port,
            mensaje:'Respuesta test a pregunta '+pregunta.id,
            titulo: 'Respuesta test a pregunta '+ pregunta.id,
            id:pregunta.id
        }
    };

    requestPromise(options)
        .then(function (result) {
            //succeeded
            console.log(result)
        })
        .catch(function (err) {
            //post failed
            console.log(err);
        });


}






