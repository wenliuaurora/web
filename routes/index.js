let express = require('express');
let router = express.Router();

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/mainpage');
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/user', require('./users'));
    app.use('/video', require('./video'));
    app.use('/newvideo', require('./newvideo'));
    app.use('/mainpage', require('./mainpage'));
};
