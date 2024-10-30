const Joi = require("joi").extend(require("@joi/date"));

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(30),

  description: Joi.string(),
  location: Joi.string(),
  price: Joi.number().min(0),
  url: Joi.string().allow("", null),
  country: Joi.string(),
});

const reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().min(1).max(5),
  createdAt: Joi.date().format("YYYY-MM-DD").utc().optional(),
});

module.exports = { listingSchema, reviewSchema };
