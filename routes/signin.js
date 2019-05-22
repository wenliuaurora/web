const md5 = require('md5');
const express = require('express');
const router = express.Router();
const formidable = require('formidable');

const User = require('../controller/UserController');
const checkHaventLogin = require('./checkLogin').checkHaventLogin;

router.get('/', checkHaventLogin, function (req, res, next) {
    res.render('signin', function (err, html) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            return res.redirect('/mainpage');
        }else{
            res.send(html);
        }
    })
});

router.post('/', checkHaventLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("Error");
            fs.unlink(files.avatar.path, function (err) {
                if (err) console.log("WDNMD");
            });
            req.flash('error', 'server problem');
            return res.redirect('/mainpage');
        }
        const email = fields.email;
        const password = md5(fields.password);
        console.log(email, password);
        User.findUserByEmail(email)
            .then(function (user) {
                if (!user) {
                    req.flash('error', 'User does not exist');
                    return res.redirect('/mainpage');
                }
                if (password !== user.password){
                    req.flash('error', 'Password is wrong');
                    return res.redirect('back');
                }
                req.flash('success', 'Login successfully');
                console.log('User logged in');
                delete user.password;
                req.session.user = user;
                return res.redirect('/mainpage');
            }).catch(next);
    });
});

module.exports = router;

