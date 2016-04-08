
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var preguntasAlumno = [];

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

app.post('/recibir', function (req, res) {
    
    preguntasAlumno.push(req.body);
    console.log(preguntasAlumno);
    res.send('ok');
})


app.listen(8002, function () {
    console.log('Alumno app listening on port 8082!');
});