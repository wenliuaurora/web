const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Video = require('../controller/VideoController');

// GET search?videoName=XXX
router.get('/', function (req, res, next) {
    const videoName = req.query.videoName;
    Video.findVideosByNameSimilarity(videoName)
        .then(function (videos) {
            res.render('search',
                {videos: videos},
                function (err, html) {
                    if (err) {
                        console.log(err);
                        res.send('find videos by name err');
                    }
                    res.send(html);
                })
        }).catch(next);
});

// GET search?userName=XXX
router.get('/', function (req, res, next) {
    const userName = req.query.userName;
    Video.findVideosByOwnerSimilarity(userName)
        .then(function (videos) {
            res.render('search',
                {videos: videos},
                function (err, html) {
                    if (err) {
                        console.log(err);
                        res.send('Find user videos err');
                    }
                    res.send(html);
                })
        })
})
