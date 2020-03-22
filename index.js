'use strict'
var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso',{ useNewUrlParser:true, useUnifiedTopology: true }, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La base de datos se ha conectado correctamente...');
    }
});