import { asyncHandler } from "../utils/asyncHandler";

export  const registerUser = asyncHandler(async (req , res) => {
         const {userName, email ,Fullname  , password} = req.body
         console.log("Email : " , email);  
})