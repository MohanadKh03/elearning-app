import { Request, Response } from "express"
import { ApiResponse } from "../utils/api.response"
import { UserService } from "../services/user.service"
import { IUser } from "../models/user.model";

export class UserController{
    static async createUser(req: Request,res: Response){
        const user = req.body as IUser;
        const response : ApiResponse = await UserService.createUser(user)
        return res.status(response.status).json(response.body)
    }
    static async updateUser(req: Request,res: Response){
        const userId = req.params.id
        const user = req.body as IUser
        const response : ApiResponse = await UserService.updateUser(userId,user)
        return res.status(response.status).json(response.body)
    }
    static async deleteUser(req: Request,res: Response){
        const userId = req.params.id
        const response : ApiResponse = await UserService.deleteUser(userId)
        return res.status(response.status).json(response.body)
    }
}