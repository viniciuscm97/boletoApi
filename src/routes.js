const { Router } = require('express');
const Boleto = require('./controllers/boleto');
const BankTitle = require('./class/bankTitle');
const DealershipTitle = require('./class/dealershipTitle');

const routes = Router();

const boleto = new Boleto(BankTitle, DealershipTitle);

routes.get('/boleto/:id', boleto.consultLines.bind(boleto));

module.exports = routes;