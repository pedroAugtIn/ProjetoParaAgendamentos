const Login = require('../models/LoginModel');
 
exports.register = async function (req, res) { 
// não fazemos validação de dados aqui. Faremos em um model
// se colocarmos res.send(req.body) neste campo, em meu localhost será exibido as informações do formulário
// como o método register() (importado de LoginModel) apresenta resposta em forma de promisse, nosso register precisa ser async e await também
    try {
        const login = new Login(req.body);
        await login.register()
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            // como eu quero que retorne para a página de login exibindo o erro, primeiro precisamos salvar a sessão para garantir que será salva
            req.session.save(function(){
                return res.redirect('/register')
            });
            return;
        }

        req.flash('success', "Seu usuário foi criado com sucesso.");
        req.session.save(function(){
            return res.redirect('/register')
        });
    } catch(e){
        console.log(e)
        return res.render('404')
    }
};

exports.login = async function(req, res) { 
    try {
        const login = new Login(req.body);
        await login.login()

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            // como eu quero que retorne para a página de login exibindo o erro, primeiro precisamos salvar a sessão para garantir que será salva
            req.session.save(function(){
                return res.redirect('/login')
            });
            return;
        }

        req.flash('success', "Você está conectado.");
        req.session.user = login.user;
        req.session.save(function(){
            return res.redirect('/login')
        });
    } catch(e){
        console.log(e)
        return res.render('405')
    }
};

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/')
}