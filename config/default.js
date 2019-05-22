module.exports = {
    port: 3000,
    session: {
        secret: 'libilibi',
        key: 'libilibi',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/libilibi',
    videoDir: 'Video',
    avatarDir: '../public/Avatar'
};
