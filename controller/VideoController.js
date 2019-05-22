const Video = require('../database/VideoModel').Video;

module.exports = {
    /* create a new video*/
    create: function (video) {
        return Video.create(video);
    },

    /* find one video by videoId */
    getVideoById: function (videoId) {
        return Video.findOne({
            videoId: videoId
        });
    },

    getAllVideosByCategory: function (category) {
        return Video.find({
            category: category
        });
    },

    /* find someone's all videos */
    findAllVideos: function (owner) {
        return Video.find({
            owner: owner
        }).sort({createTime: -1});
    },

    deleteVideoById: function (videoId) {
        return Video.remove({
            videoId: videoId
        });
    },

    updateDescriptionById: function (videoId, description) {
        return Video.updateOne({
            videoId: videoId
        }, {
            description: description
        });
    },

    addCommentToVideoById: function (videoId, id, poster, time, content) {
        return Video.updateOne({videoId: videoId},
            {$push: {comments: {id: id, poster: poster, createTime: time, content: content}}});
    },

    removeCommentFromVideoById: function(videoId, id){
        return Video.updateOne({videoId: videoId},
            {$pull: {comments: {id: id}}});
    },

    addFloatCommentToVideoById: function (videoId, id, poster, time, content, size, position) {
        return Video.updateOne({videoId: videoId},
            {$push: {floatComments: {id: id, poster: poster, time: time, content: content, size: size, position: position}}});
    },

    getFloatCommentByVideoId: function (videoId) {
        return Video.find(
            {videoId: videoId},
            'floatComments',
        );
    },

    removeFloatCommentToVideoById: function(videoId, id){
        return Video.updateOne({videoId: videoId},
            {$pull: {floatComments: {id: id}}});
    },

    updateLikesByVideoId: function (videoId) {
        return Video.updateOne({videoId: videoId},
            {$inc: {likes: 1}});
    },

    cancelLikesByVideoId: function (videoId) {
        return Video.updateOne({videoId: videoId},
            {$inc: {likes: -1}});
    },

    findTopTenVideos: function () {
        return Video.aggregate()
            .sort({likes: -1})
            .limit(10);
    },

    findNewestTenVideos: function () {
        return Video.aggregate()
            .limit(10);
    },

    findVideosByNameSimilarity: function (reg) {
        return Video.find(
            {videoName: {$regex: reg, $options: 'i'}}
        ).limit(100);
    },

    findVideosByOwnerSimilarity: function (reg) {
        return Video.find(
            {owner: reg}
        ).sort({createTime: -1}).limit(100);
    }
};
