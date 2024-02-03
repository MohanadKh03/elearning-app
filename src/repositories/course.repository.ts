import { ICourse } from "../models/types/course.model";
import Course from "../models/types/course.model";
import { IUser } from "../models/types/user.model";
import { ObjectId } from "mongoose";

export class CourseRepository{
    static async getEntrolledStudentsForCourse(courseId: string) : Promise<IUser[] | null>{
        const users: IUser[] | null = await Course.findById(courseId)
        return users
    }

    static async getAllCourses() : Promise<ICourse[]>{
        const courses: ICourse[] = await Course.find();
        return courses;
    }

    static async getCourse(courseId: string) : Promise<ICourse | null>{
        const course: ICourse | null = await Course.findById(courseId);
        return course
    }

    static async createCourse(course: ICourse) : Promise<any>{
        const createdCourse = await Course.create(course);
        return createdCourse
    }
    static async updateCourse(courseId : string,updatedCourse: ICourse) : Promise<ICourse | null>{
        const result: ICourse | null = await Course.findByIdAndUpdate(courseId,updatedCourse ,{ new: true });
        return result
    }

    
    static async deleteCourse(courseId: string) : Promise<ICourse | null>{
        const result: ICourse | null = await Course.findByIdAndDelete(courseId, { new: true });
        return result
    }
}