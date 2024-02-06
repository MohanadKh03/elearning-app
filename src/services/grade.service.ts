import { IGrade }  from '../models/types/grade.model';
import { ApiResponse } from '../utils/api.response';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"
import  *  as exceptions from "../exceptions/errors"
import gradeSchema from "../models/validators/validator.grade"
import Joi from 'joi';
import { GradeRepository } from '../repositories/grade.repository';
import { CourseRepository } from '../repositories/course.repository';
import { UserRepository } from '../repositories/user.repository';

export class CourseService{
    static async assignGrade(grade: IGrade): Promise<ApiResponse>{

        //validate
        //do 
        //return
        if(!isValidObjectId(grade.course))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(!isValidObjectId(grade.student))
            throw new exceptions.InvalidInput("Invalid student id!")
        const { error } = gradeSchema.validate(grade,{ abortEarly: false });
        if(error)
            throw new Joi.ValidationError(error.message, error.details, error)
        let studentId = grade.student.toString()
        let courseId = grade.course.toString()
        
        let student: any = await UserRepository.getUser(studentId)
        if(student === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        let course = await CourseRepository.getCourse(courseId)
        if(course === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        if(course.students.indexOf(student._id) === -1)
            throw new exceptions.NotFound("Student did not take this course!")
        
        let createdGrade = await GradeRepository.assignGrade(grade);
        return {message: "Grade assigned successfully!", body: createdGrade , status: 201}
    }

    static async viewStudentGrade(studentId: string,courseId: string | undefined): Promise<ApiResponse>{
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(courseId && !isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(await UserRepository.getUser(studentId) === null)
            throw new exceptions.NotFound("Student not found!")
        if(courseId){
            if(await CourseRepository.getCourse(courseId) === null)
                throw new exceptions.NotFound("Course not found!")
            
        }
        let grades = await GradeRepository.viewStudentGrade(studentId,courseId);
        return {message: "Grades fetched successfully!", body: grades , status: 200}
    }
    
    static async viewAverageCourseGrades(courseId: string): Promise<ApiResponse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(await CourseRepository.getCourse(courseId) === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        let grades = await GradeRepository.viewAverageCourseGrades(courseId);
        let requestBody = "Average of grades for course " + courseId + " is " + grades;
        return {message: "Grades fetched successfully!", body: requestBody  , status: 200}
    }
    static async deleteGrade(studentId: string, courseId: string): Promise<ApiResponse> {
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if (await UserRepository.getUser(studentId) === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        if (await CourseRepository.getCourse(courseId) === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        let deleteGrade = await GradeRepository.deleteGrade(studentId, courseId);
        return {message: "Grade deleted successfully!", body: deleteGrade , status: 200}
    }

}