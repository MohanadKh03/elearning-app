import { IGrade }  from '../models/types/grade.model';
import { ApiResponse } from '../utils/api.response';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"
import  *  as exceptions from "../exceptions/errors"
import gradeSchema from "../models/validators/validator.grade"
import Joi from 'joi';
import { GradeRepository } from '../repositories/grade.repository';
import { CourseRepository } from '../repositories/course.repository';

export class CourseService{
    static async assignGrade(grade: IGrade): Promise<ApiResponse>{
        if(!isValidObjectId(grade.course))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(!isValidObjectId(grade.student))
            throw new exceptions.InvalidInput("Invalid student id!")
        const { error } = gradeSchema.validate(grade,{ abortEarly: false });
        if(error)
            throw new Joi.ValidationError(error.message, error.details, error)
        let createdGrade = await GradeRepository.assignGrade(grade);
        return {message: "Grade assigned successfully!", body: createdGrade , status: 201}
    }

    static async viewStudentGrade(studentId: string,courseId: string | undefined): Promise<ApiResponse>{
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(courseId && !isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let grades = await GradeRepository.viewStudentGrade(studentId,courseId);
        return {message: "Grades fetched successfully!", body: grades , status: 200}
    }
    
    static async viewAverageCourseGrades(courseId: string): Promise<ApiResponse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let grades = await GradeRepository.viewAverageCourseGrades(courseId);
        let requestBody = "Average of grades for course " + courseId + " is " + grades;
        return {message: "Grades fetched successfully!", body: requestBody  , status: 200}
    }
    static async deleteGrade(studentId: string, courseId: string): Promise<ApiResponse> {
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let deleteGrade = await GradeRepository.deleteGrade(studentId, courseId);
        return {message: "Grade deleted successfully!", body: deleteGrade , status: 200}
    }

}