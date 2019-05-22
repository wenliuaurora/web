const md5 = require('md5');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const User = require('../controller/UserController');
const checkHaventLogin = require('./checkLogin').checkHaventLogin;
const formidable = require('formidable');
const config = require('config-lite')(__dirname);

// GET /signup
// TODO: change to real render
router.get('/', checkHaventLogin, function (req, res, next) {
    res.render('signup', function (err, html) {
        if (err) {
            console.log("ERROR");
            console.log(err);
        }else{
            res.send(html);
        }
    });
});

// POST /signup -> create a new user
router.post('/', checkHaventLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();
    // TODO: Change to relative path
    form.uploadDir = '/Users/ComingWind/WebstormProjects/WebT/public/Avatar';
    // Set maximum avatar size to be 1 MB
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err){
            console.log("Error");
            fs.unlink(avatar, function (err) {
                if (err) console.log("DLLM");
            });
            req.flash('error', 'server problem');
            return res.redirect('/signup');
        }
        const email = fields.email;
        const userName = fields.userName;
        let password = md5(fields.password);
        const intro = fields.selfIntro;
        const gender = fields.gender;
        const avatar = files.avatar.path.split(path.sep).pop();

        // check if duplicated email exists
        User.findUserByEmail(email)
            .then(function (user) {
                if (user) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/signup');
            }
                User.create({
                    email: email,
                    userName: userName,
                    password: password,
                    gender: gender,
                    profilePhoto: avatar,
                    selfIntro: intro,
                    like: [],
                    favoriteUsers: []
                }).then(function (result) {
                    let user = result;
                    console.log("New user signed up");
                    delete user.password;
                    req.session.user = user;
                    req.flash('Successful', 'Sign up successfully');
                    return res.redirect('/mainpage');
                }).catch(next);
            }).catch(next);
    });
    //next();
});

module.exports = router;
