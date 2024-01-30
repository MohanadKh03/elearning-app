import { IUser } from "../models/user.model";
import User from "../models/user.model";

export class UserRepository{
    static async getUsers() : Promise<IUser[]>{
        const users: IUser[] = await User.find();
        return users
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