const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const Campground = require('../models/campground');
const review = require('../models/review');
const { joiReviewSchema } = require('../schemas');
const { isLoggedIn, validateCampground, isAuthor, storeReturnTo, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;