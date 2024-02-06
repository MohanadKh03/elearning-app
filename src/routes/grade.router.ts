import express from 'express';
import { GradeController } from "../controllers/grade.controller"

const gradeRouter = express.Router();

gradeRouter.post('/assign', GradeController.assignGrade);

gradeRouter.get('/:studentId', GradeController.viewStudentGrade);

gradeRouter.get('/average/:courseId', GradeController.viewAverageCourseGrades)

gradeRouter.delete('/:studentId/:courseId', GradeController.deleteGrade)

export default gradeRouter;