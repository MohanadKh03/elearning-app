import { NextFunction, Request, Response } from "express"
import {CourseService} from "../services/grade.service"
import { IGrade } from "../models/types/grade.model";
export class GradeController{
    static async assignGrade(req: Request,res: Response,next: NextFunction){
        try{
            let grade = req.body as IGrade;
            console.log(grade)
            let result = await CourseService.assignGrade(grade);
            return res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }
    //query parameter
    static async viewStudentGrade(req: Request,res: Response,next: NextFunction){
        try{
            console.log("HERE")
            let studentId = req.params.studentId;
            let courseId = req.query.courseId as string | undefined;
            let result = await CourseService.viewStudentGrade(studentId,courseId);
            return res.status(200).json(result);

        }catch(err){
            next(err);
        }
    }
    static async viewAverageCourseGrades(req: Request,res: Response,next: NextFunction){
        try{
            let courseId = req.params.courseId;
            let result = await CourseService.viewAverageCourseGrades(courseId);
            return res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }
    static async deleteGrade(req: Request,res: Response,next: NextFunction){
        try{
            let studentId = req.params.studentId;
            let courseId = req.params.courseId;
            let result = await CourseService.deleteGrade(studentId,courseId);
            return res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }
}