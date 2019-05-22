const express = require('express');
const router = express.Router();

const Video = require('../controller/VideoController');

// TODO: Change to real render
// TODO: Fix bug
router.get('/',  function (req, res, next) {
    Video.findTopTenVideos()
        .then(function (videos) {
            res.render('mainpage', {
                videos: videos
            });
        }).catch(next);
});

module.exports = router;
