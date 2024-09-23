import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async(req , _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
  
  
    if (!token) {
      throw new ApiError(401 , "Unauthorized request")
    }
  
    if (process.env.ACCESS_TOKEN_SECRET) {
      const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
  
  
      if (typeof decodedToken !== 'string' && '_id' in decodedToken) {
         const user =  await User.findById(decodedToken._id).select("-password -refreshToken")
  
  
         if (!user) {
          throw new ApiError(401, "Invalid access token")
         }
  
         req.user = user
         next()
      }
    }
  } catch (error : any) {
    throw new ApiError(401 , error?.message|| "Invalid access token")
  }
})