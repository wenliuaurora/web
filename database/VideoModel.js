const mongoose = require('mongoose');
const VideoSchema = require('./mongo').VideoSchema;

exports.Video = mongoose.model('Video', VideoSchema);
