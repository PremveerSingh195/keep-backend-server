import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import { ObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

export  const registerUser = asyncHandler(async (req , res) => {


    // getting data from user
        const {userName, email ,Fullname  , password} = req.body
         
    // checking data is okay or not    
        if (
            [userName, email ,Fullname  , password].some((fields) => fields?.trim() === "" )
        ) {
            throw new ApiError(400 , "All fields are required")
        }
    // checking same user is present or not in database

       const existedUser = await User.findOne({
        $or: [{email} , {userName}]
       })
       if (existedUser) {
        throw new ApiError(409 , "User Already existed")
       }
        
      interface MulterFiles {
        avatar? : Express.Multer.File[]
        [fieldname : string] : Express.Multer.File[] | undefined;
      }

      const files = req.files as MulterFiles

      const avatarLocalPath = files?.avatar?.[0]?.path

      if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required")
      }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

      if (!avatar) {
        throw new ApiError(400 , "Avatar file is required")
      }

      interface UserCreateInput {
        Fullname: string;
        avatar: string;
        userName: string;
        email: string;
        password: string;
      }

      interface UserDocument extends UserCreateInput {
        _id: ObjectId;
      }

     const newUser:UserCreateInput = {
        Fullname,
        avatar: avatar.url,
        userName: userName.toLowerCase(),
        email,
        password,
     }
      
    const createdUser : UserDocument = await User.create(newUser)

    const foundUser : UserDocument | null = await User.findById(createdUser._id).select(
        "-password -refreshtoken"
    )

    if (!foundUser) {
        throw new ApiError(500 , "Something went wrong while registering the user")
    }

     return res.status(201).json(
        new ApiResponse(200 , foundUser , "User registered Successfully")
     )
})