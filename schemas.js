const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.joiCampgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().min(0).required(),
        // images: joi.string().required(),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
});

module.exports.joiReviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required().escapeHTML(),
        rating: joi.number().min(1).max(5).required(),
    }).required()
});