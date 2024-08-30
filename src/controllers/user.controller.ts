import { asyncHandler } from "../utils/asyncHandler.ts";

export  const registerUser = asyncHandler(async (req , res) => {
    res.status(200).json({
        message : "ok"
    })
})