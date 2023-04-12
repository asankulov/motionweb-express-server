const Joi = require('joi');

const postCreateSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  isPaid: Joi.boolean().optional(),
  hashtags: Joi.array().items(Joi.string()),
});

const postsQuerySchema = Joi.object({
  minVotes: Joi.number().optional(),
  isPaid: Joi.boolean().optional(),
  hashtags: Joi.array().items(Joi.string()).single(),
});

module.exports = {
  postCreateSchema,
  postsQuerySchema,
};
