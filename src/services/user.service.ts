import { IUser }  from '../models/user.model';
import { ApiResponse } from '../utils/api.response';
import { UserRepository } from '../repositories/user.repository';
import mongoose,{ ObjectId, isValidObjectId } from "mongoose"

export class UserService{
    static async createUser(user: IUser) : Promise<ApiResponse>{
        const createdUser = await UserRepository.createUser(user);
        return {message: "User created successfully!", body: createdUser , status: 201}
    }
    static async updateUser(userId: string,user: IUser) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            return {message: "Invalid user id!", body: null , status: 400}

        let userObjectId : ObjectId = new mongoose.Schema.ObjectId(userId)
        
        const updatedUser = await UserRepository.updateUser(userObjectId,user);
        return {message: "User updated successfully!", body: updatedUser , status: 200}
    }
    static async deleteUser(userId: string) : Promise<ApiResponse>{
        if(!isValidObjectId(userId))
            return {message: "Invalid user id!", body: null , status: 400}
        let userObjectId : ObjectId = new mongoose.Schema.ObjectId(userId)

        const deletedUser = await UserRepository.deleteUser(userObjectId);
        return {message: "User deleted successfully!", body: deletedUser , status: 200} 
    }
}