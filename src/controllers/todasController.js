exports.register = (req, res) => {
    res.render('register');
    return;
};
exports.login = (req, res) => {
    res.render('login');
    return;
};
exports.schedule = (req, res) => {
    res.render('schedule');
    return;
};
exports.appointments = (req, res) => {
    res.render('appointments');
    return;
};
exports.logoutt = (req, res) => {
    res.send('Você foi desconectado.');
    return;
};