import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { IGetAuthInfoRequest } from "../express";


export const verifyJWT = asyncHandler(async (req: IGetAuthInfoRequest, _, next) => {
  try {
    const token = req?.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

    console.log(token);
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }
    if (process.env.ACCESS_TOKEN_SECRET) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      console.log(decodedToken , "decoded token -----------");
      

      if (typeof decodedToken !== 'string' && '_id' in decodedToken) {
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if (!user) {
          throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()
      }
    }
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
})