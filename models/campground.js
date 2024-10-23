const mongoose = require('mongoose');
const review = require('./review');
const { ref, required } = require('joi');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
}, opts);

campgroundSchema.virtual('properties.popUpText').get(function () {
    // return `<a href="/campgrounds/${this.id}">${this.title}</a>
    // <p>${this.location}</p>`

    return `<div class="card" style = "width: 100%; border:none;">
                <div class="card-body">
                    <b><h5 class="card-title">${this.title}</h5></b>
                    <p class="card-text">${this.description.substring(0, 50)}</p>
                    <a href="/campgrounds/${this.id}" class="btn btn-primary btn-sm" target="_blank">Go To Campground Page <a>
                </div>
            </div>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', campgroundSchema);