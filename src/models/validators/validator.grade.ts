import Joi from 'joi';

const gradeSchema = Joi.object({
    student: Joi.string().required().messages({
        'any.required': 'Student field is required!'
    }),
    course: Joi.string().required().messages({
        'any.required': 'Course field is required!'
    }),
    grade: Joi.number().required().min(0).max(100).messages({
        'any.required': 'Grade field is required!',
        'number.min': 'Grade must be at least 0!',
        'number.max': 'Grade must be at most 100!'
    }),
    feedback: Joi.string().allow(null)
});

export default gradeSchema;
