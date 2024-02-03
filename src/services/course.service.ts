import { ICourse }  from '../models/types/course.model';
import { IUser }  from '../models/types/user.model';
import { ApiResponse } from '../utils/api.response';
import  courseSchema  from "../models/validators/validator.course"
import { CourseRepository } from '../repositories/course.repository';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"
import  *  as exceptions from "../exceptions/errors"
import Joi from 'joi';
import cloudinary from 'cloudinary';
import { UserService } from './user.service';




export class CourseService{
    static async getEntrolledStudentsForCourse(courseId: string) : Promise<ApiResponse>{
        const result: ApiResponse = await CourseService.getCourse(courseId)
        if(result.status !== 200)
            throw new Error("Unexpected behavior!")
        else{
            let course = result.body as ICourse;
            let studentsIds: mongoose.Types.ObjectId[] = course.students
            let students: IUser[] = []
            studentsIds.forEach((studentId) => {
                UserService.getUser(studentId.toString())
                    .then((response) => {
                        if(response.status === 200)
                            students.push(response.body)
                        else
                            throw new Error("Unexpected behavior!")
                    })
            })
            return {message: "Students fetched successfully!", body: students , status: 200}
        }
    }
    static async getAllCourses() : Promise<ApiResponse>{
        const courses: ICourse[] = await CourseRepository.getAllCourses()
        return {message: "Courses fetched successfully!",body:courses,status: 200}
    }

    static async getCourse(courseId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        const course = await CourseRepository.getCourse(courseId);
        if(course === null)
            throw new exceptions.NotFound("Course not found!")
        return {message: "Course fetched successfully!", body: course , status: 200}
    }


    static async createCourse(professorId: string,course: ICourse, courseImage: Express.Multer.File) : Promise<ApiResponse>{
        const { error, value } = courseSchema.validate(course,{ abortEarly: false });
        if(error)
            throw new Joi.ValidationError(error.message, error.details, error)
        if(courseImage !== undefined){
            try{
                await CourseService.uploadCourseImage(course,courseImage.path)
            }catch(err){
                console.error(err)
                throw new exceptions.InternalServerError("Error while uploading image!")
            }
        }
        course.professor = new mongoose.Types.ObjectId(professorId);

        const createdCourse = await CourseRepository.createCourse(course);
        return {message: "Course created successfully!", body: createdCourse , status: 201}
    }

    private static async uploadCourseImage(course: ICourse,imagePath: string) : Promise<void>{
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME!,
            api_key: process.env.API_KEY!,
            api_secret: process.env.API_SECRET!
        });
        const result : cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(imagePath);
        course.imageUrl = result.url;
    }

    static async updateCourse(courseId: string,course: ICourse,courseImage: Express.Multer.File) : Promise<ApiResponse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(courseImage !== undefined){
            try{
                await CourseService.uploadCourseImage(course,courseImage.path)
            }catch(err){
                console.error(err)
                throw new exceptions.InternalServerError("Error while uploading image!")
            }
        }
        const updateCourse = await CourseRepository.updateCourse(courseId,course);
        if(updateCourse === null)
            throw new exceptions.NotFound("Course not found!")
        return {message: "course updated successfully!", body: updateCourse , status: 200}
    }

    
    static async deleteCourse(courseId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME!,
            api_key: process.env.API_KEY!,
            api_secret: process.env.API_SECRET!
        });

        const course: ICourse|null = await CourseRepository.getCourse(courseId);
        if(course === null)
            throw new exceptions.NotFound("Course not found!")
        const deletedCourse = await CourseRepository.deleteCourse(courseId);
        if(course.imageUrl !== undefined){
            let imageName : string = course.imageUrl.split("/").pop()!.split(".")[0];
            let imageNameWithoutExtension: string = imageName.split(".")[0];
            cloudinary.v2.uploader.destroy(imageNameWithoutExtension);
        }
        return {message: "User deleted successfully!", body: null , status: 200} 
    }
}