const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/tent-n-trek')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
const sample = arr => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < cities.length; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 500 + 500)
        const camp = new Campground({
            author: '66f542fc8322aee6013ceaa4',
            location: `${cities[random].city}, ${cities[random].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random].longitude, cities[random].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            description: '    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique consectetur repudiandae sit magni dolor officiis harum consequatur pariatur perferendis ullam distinctio aspernatur, at esse incidunt molestias reiciendis rerum dignissimos! Ducimus.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dkywndf0x/image/upload/v1727708037/Tent%20N%20Trek/dr4io3regsurvivd9r3r.png',
                    filename: 'Tent N Trek/dr4io3regsurvivd9r3r',
                },
                {
                    url: 'https://res.cloudinary.com/dkywndf0x/image/upload/v1727708039/Tent%20N%20Trek/es2abywjlwwazpid1hvx.jpg',
                    filename: 'Tent N Trek/es2abywjlwwazpid1hvx',
                }
            ]
        })
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
