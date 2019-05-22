const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config-lite')(__dirname);
mongoose.connect(config.mongodb);

exports.UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: String,
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['m', 'f', 'x'],
        default: 'x'
    },
    profilePhoto: String,
    like: [{
        videoId: {
            type: String,
            required: true
        }
    }],
    favoriteUsers: [{
        email: {
            type: String,
            required: true
        }
    }],
    selfIntro: String
});

exports.UserSchema.index({email: 1});

exports.VideoSchema = new Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    videoPath: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    videoName: {
        type: String,
        required: true
    },
    description: String,
    createTime: {
        type: Date,
        default: Date.now(),
        required: true
    },
    likes: Number,
    category: {
        type: String,
        enum: ['animation', 'music', 'dance', 'game', 'tech', 'life', 'fashion', 'guichu'],
        required: true
    },
    comments: [{
        id: {
            type: String,
            required: true
        },
        poster: {
            type: String,
            required: true
        },
        createTime: {
            type: Date,
            default: Date.now()
        },
        content: {
            type: String,
            required: true
        }
    }],
    floatComments: [{
        id: {
            type: String,
            required: true
        },
        poster:{
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    }],
    coverImage: {
        type: String,
        required: true
    }
});



