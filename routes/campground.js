const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const Campground = require('../models/campground');
const { joiCampgroundSchema } = require('../schemas');
const { isLoggedIn, validateCampground, isAuthor, storeReturnTo } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../Cloudinary')
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;