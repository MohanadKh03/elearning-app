import Joi from 'joi';

const userSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.required': 'First Name field is required!'
    }),
    lastName: Joi.string().required().messages({
        'any.required': 'Last Name field is required!'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email field is required!',
        'string.email': 'Invalid email format'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required': 'Password field is required!',
        'string.min': 'Password must be at least 8 characters long!'
    }),
    role: Joi.string().valid('Student', 'Professor').default('Student')
});

export default userSchema;
