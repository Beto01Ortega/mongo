'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/probandoControlador', UserController.pruebas);

module.exports = api;