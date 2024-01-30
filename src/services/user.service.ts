import { IUser }  from '../models/user.model';
import { ApiResponse } from '../utils/api.response';
import bcrypt from "bcrypt";
import { UserRepository } from '../repositories/user.repository';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"

export class UserService{
    static async getUsers() : Promise<ApiResponse>{
        const users = await UserRepository.getUsers();
        console.log(users)
        return {message: "Users fetched successfully!", body: users , status: 200}
    }
    static async createUser(user: IUser) : Promise<ApiResponse>{
        user.password = await bcrypt.hash(user.password, 10)
        const createdUser = await UserRepository.createUser(user);
        return {message: "User created successfully!", body: createdUser , status: 201}
    }
    static async updateUser(userId: string,user: IUser) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            return {message: "Invalid user id!", body: null , status: 400}
        
        const updatedUser = await UserRepository.updateUser(userId,user);
        if(updatedUser !== null)
            return {message: "User updated successfully!", body: updatedUser , status: 200}
        return {message: "User not found!", body: null , status: 404}
    }
    static async deleteUser(userId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            return {message: "Invalid user id!", body: null , status: 400}
        const deletedUser = await UserRepository.deleteUser(userId);
        if(deletedUser !== null)
            return {message: "User deleted successfully!", body: deletedUser , status: 200} 
        return {message: "User not found!", body: null , status: 404}
    }
}