import express from 'express';
import { CourseController } from "../controllers/course.controller"

const courseRouter = express.Router();

courseRouter.get('/:id/students', CourseController.getEnrolledStudentsForCourse);

courseRouter.get('/:id', CourseController.getCourse);

courseRouter.get('/', CourseController.getAllCourses);

courseRouter.post('/create/:professorId', CourseController.createCourse);

courseRouter.post('/:courseId/enroll/:studentId', CourseController.enrollStudentInCourse);

courseRouter.put('/:id', CourseController.updateCourse);

courseRouter.delete('/:id', CourseController.deleteCourse);

courseRouter.delete('/:courseId/drop/:studentId', CourseController.dropStudentFromCourse);

export default courseRouter;