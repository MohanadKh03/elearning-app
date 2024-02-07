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

    private static async getStudentsFromCourse(course: ICourse): Promise<IUser[]>{
        let studentsIds: mongoose.Types.ObjectId[] = course.students

            let students: IUser[] = []
            const promises = studentsIds.map(async (studentId) => {
                let result = await UserService.getUser(studentId.toString());
                if (result.status === 200) {
                    students.push(result.body as IUser);
                } else {
                    throw new exceptions.NotFound("Student with id {" + studentId + "} not found!")
                }
            });
            await Promise.all(promises);
            
            return students
    }

    static async getEntrolledStudentsForCourse(courseId: string) : Promise<ApiResponse>{
        const result: ApiResponse = await CourseService.getCourse(courseId)
        if(result.status !== 200)
            throw new Error("Unexpected behavior!")
        else{
            let course = result.body as ICourse;
            
            let students = await CourseService.getStudentsFromCourse(course)
            
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


    private static async validateCreatingCourseInput(course: ICourse, courseImage: Express.Multer.File){
        const { error } = courseSchema.validate(course,{ abortEarly: false });
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
    }

    static async createCourse(professorId: string,course: ICourse, courseImage: Express.Multer.File) : Promise<ApiResponse>{
        
        await CourseService.validateCreatingCourseInput(course,courseImage)

        course.professor = new mongoose.Types.ObjectId(professorId);

        const createdCourse = await CourseRepository.createCourse(course);

        return {message: "Course created successfully!", body: createdCourse , status: 201}
    }

    private static async validateEnrollment(courseId: string,studentId: string): Promise<ICourse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        const course = await CourseRepository.getCourse(courseId);
        if(course === null)
            throw new exceptions.NotFound("Course not found!")
        return course
    }

    static async enrollStudentInCourse(courseId: string,studentId: string) : Promise<ApiResponse>{
        
        let course = await CourseService.validateEnrollment(courseId,studentId)

        const result = await UserService.getUser(studentId);
        if(result.status !== 200)
            throw new exceptions.NotFound("Student not found!")

        course.students.push(new mongoose.Types.ObjectId(studentId));
       
        const updatedCourse = await CourseRepository.updateCourse(courseId,course);
        return {message: "Student enrolled successfully!", body: updatedCourse , status: 200}
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

    private static async validateUpdatingCourse(courseId: string,course: ICourse,courseImage: Express.Multer.File){
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
    }

    static async updateCourse(courseId: string,course: ICourse,courseImage: Express.Multer.File) : Promise<ApiResponse>{
        
        await CourseService.validateUpdatingCourse(courseId,course,courseImage)

        const updateCourse = await CourseRepository.updateCourse(courseId,course);
        if(updateCourse === null)
            throw new exceptions.NotFound("Course not found!")
        return {message: "course updated successfully!", body: updateCourse , status: 200}
    }


    private static async validateDroppingFromCourse(courseId: string,studentId: string): Promise<ICourse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        if(!isValidObjectId(studentId))
            throw new exceptions.InvalidInput("Invalid student id!")
        const course = await CourseRepository.getCourse(courseId);
        if(course === null)
            throw new exceptions.NotFound("Course not found!")
        const student = await UserService.getUser(studentId);
        if(student.status !== 200)
            throw new exceptions.NotFound("Student not found!")
        return course
    }

    private static async validateStudentEnrollment(course: ICourse,studentId: string){
        let studentIndex = course.students.indexOf(new mongoose.Types.ObjectId(studentId));
        if(studentIndex === -1)
            throw new exceptions.NotFound("Student not found in course!")
        course.students.splice(studentIndex,1);
    }

    static async dropStudentFromCourse(courseId: string,studentId: string) : Promise<ApiResponse>{
   
        let course : ICourse = await CourseService.validateDroppingFromCourse(courseId,studentId)

        await CourseService.validateStudentEnrollment(course,studentId)
        
        const updatedCourse = await CourseRepository.updateCourse(courseId,course);
        return {message: "Student dropped successfully!", body: updatedCourse , status: 200}
    }
    
    static async dropStudentFromAllCourses(studentId: string) : Promise<ApiResponse>{
        const courses = await CourseRepository.getAllCourses();
        const promises = courses.map(async (course: ICourse) => {
            let studentIndex = course.students.indexOf(new mongoose.Types.ObjectId(studentId));
            if(studentIndex !== -1){
                course.students.splice(studentIndex,1);
                await CourseRepository.updateCourse(course._id.toString(),course);
            }
        });
        await Promise.all(promises);
        return {message: "Student dropped from all courses successfully!", body: null , status: 200}
    }

    private static async validateDeletingCourse(courseId: string) : Promise<ICourse>{
        if(!isValidObjectId(courseId))
            throw new exceptions.InvalidInput("Invalid course id!")
        const course: ICourse|null = await CourseRepository.getCourse(courseId);
        if(course === null)
            throw new exceptions.NotFound("Course not found!")
        return course
    }


    private static async deleteCourseImage(course: ICourse){
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME!,
            api_key: process.env.API_KEY!,
            api_secret: process.env.API_SECRET!
        });
        if(course.imageUrl !== undefined){
            let imageName : string = course.imageUrl.split("/").pop()!.split(".")[0];
            let imageNameWithoutExtension: string = imageName.split(".")[0];
            cloudinary.v2.uploader.destroy(imageNameWithoutExtension);
        }
    }

    static async deleteCourse(courseId: string) : Promise<ApiResponse>{
        
        let course: ICourse = await CourseService.validateDeletingCourse(courseId)
        
        await CourseRepository.deleteCourse(courseId)

        await CourseService.deleteCourseImage(course)
 
        return {message: "User deleted successfully!", body: null , status: 200} 
    }
}