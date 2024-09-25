import { Request } from "express";
import { IUser } from "./models/user.model";

export interface IGetAuthInfoRequest extends Request {
     user? : IUser 
}