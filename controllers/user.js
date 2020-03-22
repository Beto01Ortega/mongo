'use strict'

function pruebas(req, res){
    res.status(200).send({
        message: "Probando controlador"
    });
}

module.exports = {
    pruebas
};