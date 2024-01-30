import mongoose , {ObjectId} from "mongoose";
import { IUser } from "../models/user.model";
import User from "../models/user.model";

export class UserRepository{
    static async createUser(user: IUser) : Promise<IUser>{
        const createdUser: IUser = await User.create(user);
        return createdUser
    }
    static async updateUser(userId : ObjectId,updatedUser: IUser) : Promise<IUser | null>{
        const foundUser: IUser | null = await User.findById(userId)
        if(foundUser === null) 
            return null
        await User.updateOne(foundUser);
        return updatedUser
    }
    static async deleteUser(userId: ObjectId) : Promise<IUser | null>{
        const foundUser: IUser | null = await User.findById(userId)
        if(foundUser === null) 
            return null
        
        await User.deleteOne(foundUser);
        
        return foundUser
    }
}