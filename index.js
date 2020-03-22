'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977 

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso',{ useNewUrlParser:true, useUnifiedTopology: true }, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La base de datos se ha conectado correctamente...');

        app.listen(port, function(){
            console.log('Servidor del api rest escuchando en http://localhost:'+port)
        });
    }
});