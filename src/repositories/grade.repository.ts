
import Grade from "../models/types/grade.model";
import {IGrade } from "../models/types/grade.model";
import { CourseRepository } from "./course.repository";
import { UserRepository } from "./user.repository";
import * as exceptions from "../exceptions/errors"
import mongoose, { Aggregate } from "mongoose";


export class GradeRepository{

    static async getGrade(studentId: string,courseId: string){
        return await Grade.find({student: studentId , course: courseId})
    }

    static async assignGrade(grade: IGrade): Promise<any>{
    
        const createdGrade = await Grade.create(grade);
        return createdGrade
    }

    static async viewStudentGrade(studentId: string,courseId : string | undefined): Promise<IGrade[] | null>{
        let grades: IGrade[] | null = []
        if(courseId !== undefined){
            grades = await Grade.find({student: studentId, course: courseId})
            if(grades.length === 0)
                throw new exceptions.NotFound("Student did not take this course!")
        }
        else
            grades = await Grade.find({student: studentId})
        return grades
    }
    static async viewAverageCourseGrades(courseId: string): Promise<any>{
        const gradesAvg = await Grade.aggregate(
            [
                {
                    $match : {
                        course: new mongoose.Types.ObjectId(courseId) 
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageGrade: { $avg: "$grade" }
                    }
                }
            ]
        )
        if(gradesAvg.length === 0)
            return 0
        console.log(gradesAvg)
        return gradesAvg[0].averageGrade
    }
    static async deleteGrade(studentId: string, courseId: string){
        await Grade.deleteOne({ student: studentId, course: courseId });
    }

    static async deleteAllStudentGrades(studentId: string){
        await Grade.deleteMany({ student: studentId });
    }

}