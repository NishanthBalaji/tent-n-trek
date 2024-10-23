const Campground = require('../models/campground');
const { cloudinary } = require('../Cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require('express');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });

}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    // newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

    if (req.files.length > 0) {
        newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    } else {
        newCampground.images = [{
            url: 'https://res.cloudinary.com/dkywndf0x/image/upload/v1729677955/tent_n_trek_logo_1_rw7wya.png',
            filename: 'default-image'
        }];
    }

    newCampground.author = req.user.id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'New Campground Added!');
    res.redirect(`/campgrounds/${newCampground.id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot Find The Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot Find The Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {

    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true })

    if (req.body.campground.location) {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();

        // Update the geometry field with the new geolocation data
        campground.geometry = geoData.body.features[0].geometry;
    }

    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))

    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground);
    }

    req.flash('success', 'Campground Details Updated!');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('error', 'Campground Deleted');
    res.redirect('/campgrounds');
}