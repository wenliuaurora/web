const express = require('express');
const router = express.Router();
const Video = require('../controller/VideoController');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const VideoModel = require('../database/VideoModel').Video;
const User = require('../controller/UserController');

const checkLogin = require('./checkLogin').checkLogin;
const likeCheckLogin = require('./checkLogin').likeCheckLogin;
const likeUserCheckLogin = require('./checkLogin').likeUserCheckLogin;

// FIXME: Only for test

router.get('/danmuceshi', function (req, res, next) {
    console.log("d");
    res.render('danmuceshi', function (err, html) {
        if (err) {
            console.log('Error');
            console.log(err);
        }else {
            res.send(html);
        }
    });
});

// GET /video/:videoId
// 单独播放视频页
router.get('/:videoId', function (req, res, next) {
    const videoId = req.params.videoId;

    // TODO: Render real page
    Video.getVideoById(videoId)
        .then(function (video) {
            if (!video){
                req.flash('Error', 'Server Error');
                return res.redirect('back');
            }
            res.render('video',{video: video}, function (err, html) {
                if (err) {
                    console.log("ERROR");
                    console.log(err);
                    return res.redirect('/mainpage');
                }else{
                    res.send(html);
                }
            });
        }).catch(next);
});

// GET /video/:videoId/floatcomment
// 获取弹幕
router.get('/:videoId/floatcomment', function (req, res, next) {
    const videoId = req.params.videoId;
    Video.getFloatCommentByVideoId(videoId)
        .then(function (floatComments) {
            const floats = floatComments[0].floatComments;
            let returnVal = "[";
            let first = 0;
            floats.forEach(function (float) {
                if (first === 1) {
                    returnVal += ",";
                }
                first = 1;
                returnVal += "'{";
                returnVal += "text: \"" + float.content + "\", color: \"white\", size:" + float.size + ", position:" + float.position + ",time:" + float.time;
                returnVal += "}'";
            });
            returnVal += "]";
            res.send(returnVal);
        });
});

// GET /video/owner/:ownerId
// 某一用户所有视频
router.get('/owner/:ownerId', function (req, res, next) {
    const owner = req.params.owner;
    // TODO: Render real page
    Video.findAllVideos(owner)
        .then(function (videos) {
            res.render('videoList',
                {videos: videos}, function (err, html) {
                    if (err) {
                        console.log("ERROR");
                        console.log(err);
                        return res.redirect('/mainpage');
                    }else{
                        res.send(html);
                    }
                });
        }).catch(next);
});

// GET /video/category/:categoryName
// 某一种类所有视频
router.get('/category/:categoryName', function (req, res, next) {
    const category = req.params.categoryName;
    // TODO: Render real page
    Video.getAllVideosByCategory(category)
        .then(function (videos) {
            res.render('category',
                {videos: videos}, function (err, html) {
                    if (err) {
                        console.log("ERROR");
                        console.log(err);
                        return res.redirect('/mainpage');
                    }else{
                        res.send(html);
                    }
                });
        }).catch(next);
});

// GET /video/:videoId/edit
// 编辑某个视频页面
router.get('/:videoId/edit', checkLogin, function (req, res, next) {
    const user = req.session.user.email;
    const video = req.params.videoId;
    // TODO: Render real page
    Video.getVideoById(video)
        .then(function (video) {
            if (!video) {
                req.flash('Error', 'Cannot find such video');
                return res.redirect('/mainpage');
            }
            if (video.owner !== user) {
                req.flash('Error', 'You don\'t have the right');
                return res.redirect('/mainpage');
            }
            res.render('edit', {
                video: video
            });
        }).catch(next);
});

// POST /video/:videoId/edit
// 编辑某个视频（提交）
router.post('/:videoId/edit', checkLogin, function (req, res, next) {
    // TODO: Finish this
    const user = req.session.user.email;
    const video = req.params.videoId;
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        Video.getVideoById(video)
            .then(function (video) {
                if (!video) {
                    req.flash('Error', 'Cannot find such video');
                    return res.redirect('/mainpage');
                }
                if (video.owner !== user) {
                    req.flash('Error', 'You don\'t have the right');
                    return res.redirect('/mainpage');
                }
                VideoModel.update({videoId: video},
                    {videoName: fields.videoName, description: fields.description, category: fields.category})
                    .then(function (result) {
                        req.flash('Success', 'Updated video information successfully');
                        return res.redirect('/:videoId/edit');
                    }).catch(next);
            }).catch(next);
    });
});

// POST /video/:videoID/remove
// 删除某个视频（提交）
router.post('/:videoId/remove', checkLogin, function (req, res, next) {
    const user = req.session.user.email;
    const video = req.params.videoId;

    Video.getVideoById(video)
        .then(function (video) {
            if (!video) {
                req.flash('Error', 'Cannot find such video');
                return res.redirect('/mainpage');
            }
            if (video.owner !== user) {
                req.flash('Error', 'You don\'t have the right');
                return res.redirect('/mainpage');
            }
            Video.deleteVideoById(video)
                .then(function () {
                    req.flash('Success', 'Delete video successfully');
                    fs.unlink('public/videos/' + video.videoPath);
                    return res.redirect('/user');
                }).catch(next);
        }).catch(next);
});

// POST /video/:videoId/like
// 喜欢某个视频
// TODO: 在前端写好后测试
router.post('/:videoId/like', likeCheckLogin, function (req, res, next) {
    const videoId = req.params.videoId;
    Video.updateLikesByVideoId(videoId)
        .then(function (result) {
            if (req.login === true) {
                User.addLikedVideoByVideoId(req.session.user.email, videoId).then(function (result) {
                    return req.flash('Success', 'Add to like list O(∩_∩)O');
                }).catch(next);
            }else {
                return req.flash('Success', 'Liked O(∩_∩)O');
            }
        }).catch(next);
});

// POST /video/:videoId/unlike
// 取消喜欢某个视频
// TODO: 前端写好后测试
router.post('/:videoId/unlike', likeCheckLogin, function (req, res, next) {
    const videoId = req.params.videoId;

    Video.cancelLikesByVideoId(videoId)
        .then(function (result) {
            if (req.login === true) {
                User.removeLikedVideoByVideoId(req.session.user.email, videoId).then(function (result) {
                    return req.flash('Success', 'Unliked :S');
                }).catch(next);
            }else {
                return req.flash('Success', 'Unliked :S');
            }
        }).catch(next);
});

// POST /video/:videoId/comment
// 发表评论
// TODO: 前端写好后测试
router.post('/:videoId/comment', likeUserCheckLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) {
            return req.flash('Error', 'Comment sent failed :(');
        }
        const content = fields.content;
        const id = mongoose.Types.ObjectId();
        const poster = req.session.user.email;
        const createTime = Date.now();

        Video.addCommentToVideoById(req.params.videoId, id, poster, createTime, content)
            .then(function (result) {
                console.log("Commented");
                return req.flash('Success', 'Commented :)');
            }).catch(function (err) {
            console.log(err);
        });
    });
});


// POST /video/:videoId/float
// 发表弹幕
// TODO: 前端写好后测试
router.post('/:videoId/float', likeUserCheckLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) {
            return req.flash('Error', 'Comment sent failed :(');
        }
        console.log("post float comments request");
        console.log(fields);
        const danmuEntity = JSON.parse(fields.danmu);
        console.log(danmuEntity);
        const content = danmuEntity.text;
        const id = mongoose.Types.ObjectId();
        const poster = req.session.user.email;
        const createTime = danmuEntity.time;
        const size = danmuEntity.size;
        const position = danmuEntity.position;
        console.log(content);
        Video.addFloatCommentToVideoById(req.params.videoId, id, poster, createTime, content, size, position)
            .then(function (result) {
                return req.flash('Success', 'Commented :)');
            }).catch(function (err) {
            console.log(err);
        });
    });
});

// POST /video/:videoId/removecomment
// 删除评论
// TODO: 前端写好后测试
router.post('/:videoId/removecomment', likeUserCheckLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) {
            req.flash('Error', 'Remove comment failed :(');
            return res.redirect('back');
        }
        const id = fields.commentId;

        Video.removeCommentFromVideoById(req.params.videoId, id)
            .then(function (result) {
                return req.flash('Success', 'Uncommented :)');
            }).catch(function (err) {
            console.log(err);
        });
    });
});


// POST /video/:videoId/removefloat
// 删除弹幕
// TODO: 前端写好后测试
router.post('/:videoId/removecomment', likeUserCheckLogin, function (req, res, next) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) {
            req.flash('Error', 'Remove comment failed :(');
            return res.redirect('back');
        }
        const id = fields.commentId;

        Video.removeFloatCommentToVideoById(req.params.videoId, id)
            .then(function (result) {
                req.flash('Success', 'Uncommented :)');
                return res.redirect('/'+req.params.videoId);
            }).catch(function (err) {
            console.log(err);
        });
    });
});
module.exports = router;
