import express from 'express';
import { UserController } from "../controllers/user.controller"

const userRouters = express.Router();

userRouters.post('/user/create', UserController.createUser);

userRouters.put('/user/:id', UserController.updateUser);

userRouters.delete('/user/:id', UserController.deleteUser);


export default userRouters;