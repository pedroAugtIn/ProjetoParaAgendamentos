exports.middlewareGlobal = (req, res, next) => { // ou seja, agora em todas as páginas teremos disponível esta locals.errors
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.outroMiddleware = (req, res, next) => {
    console.log('Sou seu outro middleware')
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN'){
        return res.render('404')
    }
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}