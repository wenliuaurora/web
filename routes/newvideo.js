const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const checkLogin = require('./checkLogin').checkLogin;
const Video = require('../controller/VideoController');

// GET /newvideo
// TODO: render real html
router.get('/', checkLogin, function (req, res, next) {
    res.render('newvideo', function (err, html) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            return res.redirect('/mainpage');
        }else{
            res.send(html);
        }
    });
});

// POST /newvideo
router.post('/', checkLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();
    // TODO: Change to relative path
    form.uploadDir = 'public/tmp';
    // Set maximum avatar size to be 1 GB
    form.maxFieldsSize = 1024 * 1024 * 1024;
    form.keepExtensions = true;
    fs.access(form.uploadDir, function (err) {
        if (err) {
            fs.mkdirSync(form.uploadDir);
        }
        form.parse(req, function (err, fields, files) {
            if (err){
                fs.unlink(form.uploadDir + path.sep + files.video.path.split(path.sep).pop(), function (err) {
                    throw err;
                });
                fs.unlink(form.uploadDir + path.sep + files.coverImage.path.split(path.sep).pop(), function (err) {
                    console.log(err);
                    throw err;
                });
            }
            const videoName = fields.videoName;
            const video = files.video.path.split(path.sep).pop();
            const description = fields.description;
            const owner = req.session.user.email;
            const createTime = Date.now();
            const category = fields.category;
            const likes = 0;
            const coverImage = files.coverImage.path.split(path.sep).pop();
            Video.create({
                videoName: videoName,
                videoId: mongoose.Types.ObjectId(),
                description: description,
                owner: owner,
                videoPath: video,
                createTime: createTime,
                category: category,
                likes: likes,
                comments: [],
                floatComments: [],
                coverImage: coverImage
            }).then(function (result) {
                let keys = Object.keys(files);
                keys.forEach(function (key) {
                    let filePath = files[key].path;
                    let fileExt = filePath.substring(filePath.lastIndexOf('.'));
                    if (('.jpg.jpeg.png').indexOf(fileExt.toLowerCase()) !== -1){
                        console.log('image');
                        fs.rename(filePath, 'public/coverImage/' + coverImage, function (err) {
                            if (err) throw err;
                        });
                    }
                    if (('.mp4.wmv.mov.avi').indexOf(fileExt.toLowerCase()) !== -1){
                        console.log('video');
                        fs.rename(filePath, 'public/videos/' + video, function (err) {
                            if (err) throw err;
                        });
                    }
                });
                req.flash('Success', 'Upload file successfully');
                res.redirect('/mainpage')
            }).catch(function (err) {

            });
        });
    });
});

module.exports = router;
