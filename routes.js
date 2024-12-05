const express = require('express');
const route = express.Router();
// const homeController = require('./src/controllers/homeController');
// const loginController = require('./src/controllers/loginController');
// const contatoController = require('./src/controllers/contatoController');
// const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', (req, res) => {
    return res.json({
        message: 'Olá Mundo!'
    });
});


module.exports = route;
