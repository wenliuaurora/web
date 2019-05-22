'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/* session setup */
app.use(session({
    secret: config.session.secret,
    name: config.session.key,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb,
        autoRemove: 'native'
    })
}));

app.use(flash());

// 设置模板全局常量
app.locals.blog = {
    title: 'LIBILIBI',
    description: 'welcome to LIBILIBI'
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);
    res.send("RNM");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(3000, function () {
    console.log('Start listening on port 3000');
})

module.exports = app;
