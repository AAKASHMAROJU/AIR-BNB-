const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),

  description: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().min(0).required(),
  url: Joi.string().allow("", null),
  country: Joi.string().required(),
});

module.exports = listingSchema;
