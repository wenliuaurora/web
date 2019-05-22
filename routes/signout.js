const express = require('express');
const router = express.Router();

const checkLogin = require('./checkLogin').checkLogin;

// GET /signout
router.get('/', checkLogin, function (req, res, next) {
    req.session.user = null;
    req.flash('success', 'Successfully signed out');
    res.redirect('/mainpage');
});

module.exports = router;
