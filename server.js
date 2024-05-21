require('dotenv').config(); // referente as variáveis de ambiente configuradas em .env

const express = require('express'); // iniciando express
const app = express(); // iniciando express

const mongoose = require('mongoose'); // iniciando mongoose - retorna uma promise
mongoose.connect(process.env.CONNECTIONSTRIN)
.then(() => {
    app.emit('pronto');
})
.catch(e => console.log(e));

const session = require('express-session'); // usado para identificar o navegador de um cliente, salvando um cookie com um id 
const MongoStore = require('connect-mongo'); // para falar que as sessões serão salvas dentro da base de dados;
const flash = require('connect-flash'); // são as flash mensages - "mensagens auto-destrutivas" - exibidas e apagadas da database
const helmet = require('helmet'); // recomendação do próprio express - deixa aplicação mais segura
const routes = require('./routes'); // as rotas da nossa aplicação - /home /contato etc..
const csrf = require('csurf'); // tokens criados para nossos formulários - evita que sites externos postem dentro da nossa aplicação
// nossos middlewares - funções executadas na rota - cadeia.
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net"]
    }
  }));

app.use(express.urlencoded({ extended: true })); // permite postarmos formulários para dentro de nossa aplicação;
app.use(express.json()); // permite o parse.json para dentro de nossa aplicação;
app.use(express.static('./public')); // disponibiliza ao usuário arquivos estáticos, como HTML, CSS, JavaScript, imagens, etc
app.use('/frontend/assets/img', express.static('./frontend/assets/img'));


const sessionOptions = session({
    secret: 'podeserqualquercoisa',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRIN }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', './src/views'); // são os arquivos que a gente renderiza na tela e o caminho dos arquivos
app.set('view engine', 'ejs'); // a engine que estamos utilizando para renderizar o html

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
// Chamando as rotas
app.use(routes);

app.on('pronto', () => { // parte em que determinamos nossa aplicação a escutar 'coisas'
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executado na porta 3000');
    });
})
