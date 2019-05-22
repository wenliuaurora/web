// For user manage profile
const express = require('express');
const router = express.Router();
const checkLogin = require('./checkLogin').checkLogin;
const likeUserCheckLogin = require('./checkLogin').likeUserCheckLogin;
const formidable = require('formidable');
const md5 = require('md5');
const fs = require('fs');

const User = require('../controller/UserController');
const UserModel = require('../database/UserModel').User;
const Video = require('../controller/VideoController');

// GET /user
router.get('/', checkLogin, function(req, res, next) {
    // TODO: Render real page
    res.send('User page');
});

// GET /user/change/password
router.get('/change/password', checkLogin, function (req, res, next) {
    res.render('changePassword', function (err, html) {
        // TODO: Render real page
        if (err) {
            console.log("ERROR");
            console.log(err);
        }else{
            res.send(html);
        }
    });
});

// POST /user/change/password
router.post('/change/password', checkLogin, function(req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err){
            console.log("Error");
            req.flash('error', 'server problem');
            return res.redirect('/mainpage');
        }
        const email = req.session.user.email;
        const oldPassword = md5(fields.oldPassword);
        const newPassword = md5(fields.newPassword);
        console.log(email, oldPassword, newPassword);

        User.findUserByEmail(email).then(function (result) {
            let old = result.password;
            if (old !== oldPassword) {
                req.flash('error', 'Old password not correct');
                return res.redirect('back');
            }
            User.updatePassword(email, newPassword).then(function (result) {
                req.flash('success', 'Successfully changed password');
                return res.redirect('/user');
            }).catch(next);
        }).catch(next);
    });
});

// GET /user/change/profile
// 更改个人资料页面
router.get('/change/profile', checkLogin, function (req, res, next) {
    res.render('changeProfile', function (err, html) {
        // TODO: Render real page
        if (err) {
            console.log("ERROR");
            console.log(err);
        }else{
            res.send(html);
        }
    });
});

// POST /user/change/profile
// 提交更改个人资料
router.post('/change/profile', checkLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        const userName = fields.userName;
        const intro = fields.selfIntro;
        const gender = fields.gender;

        UserModel.update({email: req.session.user.email},
            {userName: userName, selfIntro: intro, gender: gender},
            {upsert: false, multi: false}, function (err, raw) {
                if (err) {
                    console.log("Update user profile failed");
                    req.flash("Error", "Update user profile failed");
                    return res.redirect('/change/profile');
                }
            }).then(function () {
                req.flash('Success', 'Update user profile successfully');
                return res.redirect('/user');
        }).catch(next);
    });
});

// POST /user/change/newAvatar
// 提交新头像
router.post('/change/newAvatar', checkLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/Avatar';
    // Set maximum avatar size to be 1 MB
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        const email = req.session.user.email;
        const avatar = files.avatar.path.split(fs.sep).pop();
        User.findUserByEmail(email)
            .then(function (doc) {
                const oldPath = doc.profilePhoto;
                fs.unlink(oldPath, function (err) {
                    if (err) console.log("GG");
                    console.log('file');
                });
                UserModel.update({email: email}, {profilePhoto: avatar}, function (err, raw) {
                    if (err) {
                        console.log(err);
                        console.log("Update user avatar failed");
                        req.flash("Error", "Update user avatar failed");
                        return res.redirect('/user/change/profile');
                    }
                })
                    .then(function (result) {
                        req.flash('Success', 'Update user avatar successfully');
                        return res.redirect('/user');
                    }).catch(next);
            }).catch(next)
    });
});

// POST /user/:userId/like
// 喜欢某个UP主
router.post('/user/:userId/like', likeUserCheckLogin, function (req, res, next) {
    User.addFavoriteUser(req.session.user.email, req.params.userId)
        .then(function (result) {
            req.flash('Success', 'Liked up :D');
        }).catch(function (err) {
        console.log(err);
    });
});

// POST /user/:userId/unlike
// 取消喜欢某个UP主
router.post('/user/:userId/unlike', likeUserCheckLogin, function (req, res, next) {
    User.removeFavoriteUser(req.session.user.email, req.params.userId)
        .then(function (result) {
            req.flash('Success', 'Cancelled like :S');
        }).catch(function (err) {
        console.log(err);
    });
});
module.exports = router;
