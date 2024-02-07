import { NextFunction, Request, Response } from "express"
import {GradeService} from "../services/grade.service"
import { IGrade } from "../models/types/grade.model";
export class GradeController{
    static async assignGrade(req: Request,res: Response,next: NextFunction){
        try{
            let grade = req.body as IGrade;
            console.log(grade)
            let result = await GradeService.assignGrade(grade);
            return res.status(result.status).json(result);
        }catch(err){
            next(err);
        }
    }
    static async viewStudentGrade(req: Request,res: Response,next: NextFunction){
        try{
            let studentId = req.params.studentId;
            let courseId = req.query.courseId as string | undefined;
            let result = await GradeService.viewStudentGrade(studentId,courseId);
            return res.status(result.status).json(result);

        }catch(err){
            console.log("HERE")
            next(err);
        }
    }
    static async viewAverageCourseGrades(req: Request,res: Response,next: NextFunction){
        try{
            let courseId = req.params.courseId;
            let result = await GradeService.viewAverageCourseGrades(courseId);
            return res.status(result.status).json(result);
        }catch(err){
            next(err);
        }
    }
    static async deleteGrade(req: Request,res: Response,next: NextFunction){
        try{
            let studentId = req.params.studentId;
            let courseId = req.params.courseId;
            let result = await GradeService.deleteGrade(studentId,courseId);
            return res.status(result.status).json(result);
        }catch(err){
            next(err);
        }
    }
}