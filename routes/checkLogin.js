module.exports = {
    checkLogin: function (req, res, next) {
        if(!req.session.user){
            req.flash('error', 'not login in');
            return res.redirect('./signin');
        }
        next();
    },

    checkHaventLogin: function (req, res, next) {
        if(req.session.user){
            req.flash('error', 'Already logged in');
            return res.redirect('back');
        }
        next();
    },

    likeCheckLogin: function (req, res, next) {
        if (!req.session.user) {
            req.flash('Error', 'You can add to your like list after sign in :)');
            req.login = false;
        }
        req.login = true;
        next();
    },

    likeUserCheckLogin: function (req, res, next) {
        if (!req.session.user) {
            req.flash('Error', 'You have to login first :)');
            return res.redirect('back');
        }
        next();
    }
};
