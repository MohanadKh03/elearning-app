import { IGrade }  from '../models/types/grade.model';
import { ApiResponse } from '../utils/api.response';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"
import  *  as exceptions from "../exceptions/errors"
import gradeSchema from "../models/validators/validator.grade"
import Joi from 'joi';
import { GradeRepository } from '../repositories/grade.repository';
import { CourseRepository } from '../repositories/course.repository';
import { UserRepository } from '../repositories/user.repository';

export class GradeService{
    private static validateAssigningGrade(grade: IGrade){
        if(!isValidObjectId(grade.course))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(!isValidObjectId(grade.student))
            throw new exceptions.InvalidInput("Invalid student id!")
        const { error } = gradeSchema.validate(grade,{ abortEarly: false });
        if(error)
            throw new Joi.ValidationError(error.message, error.details, error)
    }
    private static async checkStudentEnrollment(studentId: string,courseId: string){
        let student: any = await UserRepository.getUser(studentId)
        if(student === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        let course = await CourseRepository.getCourse(courseId)
        if(course === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        if(course.students.indexOf(student._id) === -1)
            throw new exceptions.NotFound("Student did not take this course!")
    }
    private static async gradeAlreadyExists(studentId : string,courseId: string){
        let grade = await GradeRepository.getGrade(studentId,courseId)
        return grade.length !== 0
    }
    static async assignGrade(grade: IGrade): Promise<ApiResponse>{  
        try{
            await GradeService.validateAssigningGrade(grade)
        }catch(err){
            throw err
        }
        let studentId = grade.student.toString()
        let courseId = grade.course.toString()
        try{
            await GradeService.checkStudentEnrollment(studentId,courseId)
        }catch(err){
            throw err
        }
        let existingGrade = await GradeService.gradeAlreadyExists(studentId,courseId)
        if(existingGrade)
            throw new exceptions.InvalidInput("Grade for this student already exists!")

        let createdGrade = await GradeRepository.assignGrade(grade);
        return {message: "Grade assigned successfully!", body: createdGrade , status: 201}
    }

    private static async validateViewingGrade(studentId: string,courseId: string | undefined){
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(courseId && !isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let student = await UserRepository.getUser(studentId)
        if(student === null)
            throw new exceptions.NotFound("Student not found!")
        if(courseId){
            let course = await CourseRepository.getCourse(courseId)
            if(course === null)
                throw new exceptions.NotFound("Course not found!")
        }
    }

    static async viewStudentGrade(studentId: string,courseId: string | undefined): Promise<ApiResponse>{
        try{
            await GradeService.validateViewingGrade(studentId,courseId)
        }catch(err){
            throw err
        }
        let grades = await GradeRepository.viewStudentGrade(studentId,courseId);

        return {message: "Grades fetched successfully!", body: grades , status: 200}
    }
    
    private static async validateViewingAverageGrades(courseId: string){
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let course = await CourseRepository.getCourse(courseId)
        if(course === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
    }

    static async viewAverageCourseGrades(courseId: string): Promise<ApiResponse>{
        try{
            await GradeService.validateViewingAverageGrades(courseId)
        }catch(err){
            throw err
        }

        let grades = await GradeRepository.viewAverageCourseGrades(courseId);

        let requestBody = "Average of grades for course " + courseId + " is " + grades;
        return {message: "Grades fetched successfully!", body: requestBody  , status: 200}
    }

    private static async validateDeletingGrade(studentId: string,courseId: string){
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        let student = await UserRepository.getUser(studentId)
        if (student === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        let course = await CourseRepository.getCourse(courseId)
        if (course === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
    }

    static async deleteGrade(studentId: string, courseId: string): Promise<ApiResponse> {
        try{
            await GradeService.validateDeletingGrade(studentId,courseId)
        }catch(err){
            throw err
        } 
        await GradeRepository.deleteGrade(studentId, courseId);

        return {message: "Grade deleted successfully!", body: null , status: 200}
    }

    static async deleteAllStudentGrades(studentId: string): Promise<ApiResponse>{
        await GradeRepository.deleteAllStudentGrades(studentId)
        return {message: "Grades of this student deleted successfully!", body: null, status: 200}
    }


}