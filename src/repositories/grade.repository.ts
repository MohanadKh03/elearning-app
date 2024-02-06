
import Grade from "../models/types/grade.model";
import {IGrade } from "../models/types/grade.model";
import { CourseRepository } from "./course.repository";
import { UserRepository } from "./user.repository";
import * as exceptions from "../exceptions/errors"
export class GradeRepository{
    static async assignGrade(grade: IGrade): Promise<any>{
        let studentId = grade.student.toString()
        let courseId = grade.course.toString()
        if(await UserRepository.getUser(studentId) === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        if(await CourseRepository.getCourse(courseId) === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        const createdGrade = await Grade.create(grade);
        return createdGrade
    }

    static async viewStudentGrade(studentId: string,courseId : string | undefined): Promise<IGrade[] | null>{
        if(await UserRepository.getUser(studentId) === null)
            throw new exceptions.NotFound("Student not found!")
        if(courseId){
            if(await CourseRepository.getCourse(courseId) === null)
                throw new exceptions.NotFound("Course not found!")
            
        }
        
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
    static async viewAverageCourseGrades(courseId: string): Promise<Number>{
        if(await CourseRepository.getCourse(courseId) === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")
        // const gradesAvg = await Grade.aggregate([
        //     {
        //         $match: {
        //             course: courseId
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             averageGrade: { $avg: "$grade" }
        //         }
        //     }
        // ]);
        let avg = 0;
        let grades = await Grade.find({course: courseId})
        grades.forEach(record => {
            avg += record.grade
        })
        if(grades.length === 0)
            return 0
        avg /= grades.length
        return avg
    }
    static async deleteGrade(studentId: string, courseId: string): Promise<any> {
        if (await UserRepository.getUser(studentId) === null)
            throw new exceptions.NotFound("Student with this ID " + studentId + " not found!")
        if (await CourseRepository.getCourse(courseId) === null)
            throw new exceptions.NotFound("Course with this ID " + courseId + " not found!")

        let deleteGrade = await Grade.deleteOne({ student: studentId, course: courseId });
        return deleteGrade
    }
}