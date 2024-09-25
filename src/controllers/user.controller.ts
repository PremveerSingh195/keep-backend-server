import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import { ObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { IGetAuthInfoRequest } from "../express";
import { Response } from "express";


const generateAccessTokenandrefreshtoken = async (userId: any) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateRefreshToken();
    const refreshToken = user?.generateAccessToken();

    if (user) {
      user.refreshtoken = refreshToken;
    }
    await user?.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // getting data from user
  const { userName, email, Fullname, password } = req.body;

  // checking data is okay or not
  if (
    [userName, email, Fullname, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // checking same user is present or not in database

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(409, "User Already existed");
  }

  interface MulterFiles {
    avatar?: Express.Multer.File[];
    [fieldname: string]: Express.Multer.File[] | undefined;
  }

  const files = req.files as MulterFiles;

  const avatarLocalPath = files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
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

  const newUser: UserCreateInput = {
    Fullname,
    avatar: avatar.url,
    userName: userName,
    email,
    password,
  };

  const createdUser: UserDocument = await User.create(newUser);

  const foundUser: UserDocument | null = await User.findById(
    createdUser._id
  ).select("-password -refreshtoken");

  if (!foundUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, foundUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "email and password required for login");
  }

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { refreshToken, accessToken } =
    await generateAccessTokenandrefreshtoken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-refreshtoken -password"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Logged in succesfully"
      )
    );
});

const logoutUser = asyncHandler<IGetAuthInfoRequest>(async (req , res ) => {


  if(!req.user) {
    throw new ApiError(500 , "something went wrong")
  }

  
  await User.findByIdAndUpdate(

    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
  .status(200)
  .clearCookie("accessToken" , options)
  .clearCookie("refreshToken" , options)
  .json(
    new ApiResponse(200 , {} , "user logged out succesfully" )
  )
});

export { registerUser, loginUser, logoutUser };
