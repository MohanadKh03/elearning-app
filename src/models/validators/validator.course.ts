import Joi from 'joi';

const courseSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title field is required!'
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description field is required!'
    }),
    imageUrl: Joi.string(),
    professor: Joi.string().required().messages({
        'any.required': 'Professor field is required!'
    }),
});

export default courseSchema;
