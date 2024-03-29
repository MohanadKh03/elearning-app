import { IUser } from "../models/types/user.model";
import User from "../models/types/user.model";

export class UserRepository{
    static async getUsers() : Promise<IUser[]>{
        const users: IUser[] = await User.find();
        return users
    }


    static async getUser(userId: string) : Promise<IUser | null>{
        const user: IUser | null = await User.findById(userId);
        return user
    }


    static async createUser(user: IUser) : Promise<IUser>{
        const createdUser: IUser = await User.create(user);
        return createdUser
    }


    static async updateUser(userId : string,updatedUser: IUser) : Promise<IUser | null>{
        const result = await User.findByIdAndUpdate(userId,updatedUser ,{ new: true });
        return result
    }

    
    static async deleteUser(userId: string) : Promise<IUser | null>{
        const result = await User.findByIdAndDelete(userId, { new: true });
        return result
    }
}