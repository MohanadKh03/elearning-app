import Joi from 'joi';
import { MongoError } from 'mongodb';
import * as exceptions from "../exceptions/errors";


import { Request, Response } from "express"

const errorHandler = (err: Error, req: Request, res: Response, next: any) => {
    console.error('Error caught:', err);

    if (err instanceof Joi.ValidationError) {
        return res.status(400).json({
            status: 400,
            message: 'Validation error',
            body: err.details.map(detail => ({
                message: detail.message,
                field: detail.path.join('.')
            }))
        });
    } else if (err instanceof MongoError) {
        return res.status(500).json({
            status: 500,
            message: 'Database error',
            body: err.message
        });
    }else if(err instanceof exceptions.InvalidInput){
        return res.status(400).json({
            status: 400,
            message: err.message,
            body: null
        });
    } else if(err instanceof exceptions.NotFound){
        return res.status(404).json({
            status: 404,
            message: err.message,
            body: null
        });
    }else {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            body: err.message
        });
    }
};
export default errorHandler