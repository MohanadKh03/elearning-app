import express from 'express';
import { CourseController } from "../controllers/course.controller"

const courseRouter = express.Router();

courseRouter.get('/:id/students', CourseController.getEnrolledStudentsForCourse);

courseRouter.get('/:id', CourseController.getCourse);

courseRouter.get('/', CourseController.getAllCourses);

courseRouter.post('/create/:professorId', CourseController.createCourse);

courseRouter.put('/:id', CourseController.updateCourse);

courseRouter.delete('/:id', CourseController.deleteCourse);


export default courseRouter;