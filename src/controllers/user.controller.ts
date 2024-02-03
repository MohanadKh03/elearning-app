import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "../utils/api.response"
import { UserService } from "../services/user.service"
import { IUser } from "../models/types/user.model";

export class UserController{
    static async getUsers(req: Request,res: Response,next: NextFunction){
        try{
            const response : ApiResponse = await UserService.getUsers()
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async getUser(req: Request,res: Response,next: any){
        try{
            const userId = req.params.id
            const response : ApiResponse = await UserService.getUser(userId)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async createUser(req: Request,res: Response,next: any){
        try{
            const user = req.body as IUser;
            const response : ApiResponse = await UserService.createUser(user)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async updateUser(req: Request,res: Response,next: any){
        try{
            const userId = req.params.id
            const user = req.body as IUser

            const response : ApiResponse = await UserService.updateUser(userId,user)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
    static async deleteUser(req: Request,res: Response,next: any){
        try{
            const userId = req.params.id
            const response : ApiResponse = await UserService.deleteUser(userId)
            return res.status(response.status).json(response)
        }catch(err){
            next(err)
        }
    }
}