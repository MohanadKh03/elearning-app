import { IUser }  from '../models/types/user.model';
import { ApiResponse } from '../utils/api.response';
import bcrypt from "bcrypt";
import  userSchema  from "../models/validators/validator.user"
import { UserRepository } from '../repositories/user.repository';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"
import  *  as exceptions from "../exceptions/errors"
import Joi, { exist } from 'joi';
export class UserService{
    static async getUsers() : Promise<ApiResponse>{
        const users = await UserRepository.getUsers();
        return {message: "Users fetched successfully!", body: users , status: 200}
    }


    static async getUser(userId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            throw new exceptions.InvalidInput("Invalid user id!")
        const user = await UserRepository.getUser(userId);
        if(user === null)
            throw new exceptions.NotFound("User not found!")
        return {message: "User fetched successfully!", body: user , status: 200}
    }


    static async createUser(user: IUser) : Promise<ApiResponse>{
        const { error } = userSchema.validate(user,{ abortEarly: false });
        if(error)
            throw new Joi.ValidationError(error.message, error.details, error)
        user.password = await bcrypt.hash(user.password, 10)
        const createdUser = await UserRepository.createUser(user);
        return {message: "User created successfully!", body: createdUser , status: 201}
    }


    static async updateUser(userId: string,user: IUser) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            throw new exceptions.InvalidInput("Invalid user id!")
        
        const updatedUser = await UserRepository.updateUser(userId,user);
        if(updatedUser === null)
            throw new exceptions.NotFound("User not found!")
        return {message: "User updated successfully!", body: updatedUser , status: 200}
    }

    
    static async deleteUser(userId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            throw new exceptions.InvalidInput("Invalid user id!")
        const deletedUser = await UserRepository.deleteUser(userId);
        if(deletedUser === null)
            throw new exceptions.NotFound("User not found!")
        return {message: "User deleted successfully!", body: deletedUser , status: 200} 
    }
}