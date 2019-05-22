const mongoose = require('mongoose');
const UserSchema = require('./mongo').UserSchema;

exports.User = mongoose.model('User', UserSchema);
