import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "../utils/api.response"
import { CourseService } from "../services/course.service"
import Course, { ICourse } from "../models/types/course.model";

export class CourseController{
    static async getAllCourses(req: Request, res: Response,next : NextFunction){
        try{
            const resposne: ApiResponse = await CourseService.getAllCourses()
            return res.status(resposne.status).json(resposne)
        }catch(err){
            next(err)
        }
    }
    static async getEnrolledStudentsForCourse(req: Request,res: Response,next : NextFunction){
        try{
            const courseId = req.params.id
            const response : ApiResponse = await CourseService.getEntrolledStudentsForCourse(courseId)
            return res.status(response.status).json(response)
        }
        catch(err){
            next(err)
        }
    }
    static async getCourse(req: Request,res: Response,next: NextFunction){
        try{
            const courseId = req.params.id
            const response : ApiResponse = await CourseService.getCourse(courseId)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async createCourse(req: Request, res: Response, next: NextFunction) {
        try {
            req.body.professor = req.params.professorId;
            const { professorId } = req.params;
            const course = req.body as ICourse;
            const courseImage = req.file as Express.Multer.File;

            const response: ApiResponse = await CourseService.createCourse(professorId, course, courseImage);
            return res.status(response.status).json(response);
        } catch (err) {
            next(err);
        }
    }
    static async updateCourse(req: Request,res: Response,next: NextFunction){
        try{
            const courseId = req.params.id
            const course = req.body as ICourse
            const courseImage = req.file as Express.Multer.File;

            const response : ApiResponse = await CourseService.updateCourse(courseId,course,courseImage)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async deleteCourse(req: Request,res: Response,next: NextFunction){
        try{
            const courseId = req.params.id
            const response : ApiResponse = await CourseService.deleteCourse(courseId)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
}