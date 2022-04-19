const { Router } = require('express');
const Boleto = require('../class/boleto');
const axios = require('axios');

const routes = Router();

const boleto = new Boleto(axios);

routes.get('/boleto/:id', boleto.consultLines.bind(boleto));

module.exports = routes;