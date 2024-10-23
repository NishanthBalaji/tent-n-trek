const Campground = require('./models/campground');
const expressError = require('./utils/expressError');
const { joiCampgroundSchema, joiReviewSchema } = require('./schemas');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed In!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)) {
        req.flash('error', "You don't have the permission to do this!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', "You don't have the permission to do this!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = joiCampgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {

    const { error } = joiReviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else {
        next();
    }
}