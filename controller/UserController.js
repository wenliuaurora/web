const User = require('../database/UserModel').User;

/* Something about database */
module.exports = {
    create: function (user) {
        return User.create(user);
    },

    findUserByEmail: function (email) {
        return User.findOne({
            email: email
        });
    },

    updatePassword: function (email, newPassword) {
        return User.updateOne({email: email},
            {password: newPassword});
    },

    addLikedVideoByVideoId: function (email, videoId) {
        return User.updateOne({email: email},
            {$push: {like: {videoId: videoId}}});
    },

    removeLikedVideoByVideoId: function (email, videoId) {
        console.log("Try to insert like");
        return User.updateOne({email: email},
            {$pull: {like: {videoId: videoId}}});
    },

    addFavoriteUser: function (email, femail) {
        return User.updateOne({email: email},
            {$push: {favoriteUsers: {email, femail}}});
    },

    removeFavoriteUser: function (email, femail) {
        return User.updateOne({email: email},
            {$pull: {favoriteUsers: {email, femail}}});
    }
};
