const Campground = require('../models/campground');
const review = require('../models/review');

module.exports.addReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new review(req.body.review);
    newReview.author = req.user.id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review Added Successfully');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review Deleted!');
    res.redirect(`/campgrounds/${id}`);
}