const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const todasController = require('./src/controllers/todasController')
const loginController = require('./src/controllers/loginController');

// rotas da home
route.get('/', homeController.paginaInicial);

// rotas de register/login/logout
route.post('/register/register', loginController.register)
route.post('/login/login', loginController.login);
route.get('/logout', loginController.logout);

// rotas de contato
route.get('/register', todasController.register);
route.get('/login', todasController.login);
route.get('/schedule', todasController.schedule);
route.get('/appointments', todasController.appointments);
route.get('/logoutt', todasController.logoutt); // implementar logout após possibilitar 

module.exports = route;