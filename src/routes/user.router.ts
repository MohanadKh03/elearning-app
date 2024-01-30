import express from 'express';
import { UserController } from "../controllers/user.controller"

const userRouter = express.Router();

userRouter.get('/', UserController.getUsers);

userRouter.post('/create', UserController.createUser);

userRouter.put('/:id', UserController.updateUser);

userRouter.delete('/:id', UserController.deleteUser);


export default userRouter;