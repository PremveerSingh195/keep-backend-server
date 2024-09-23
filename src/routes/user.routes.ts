import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/user.controller";
import {upload} from '../middlewares/multer.middleware'
import { loginUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()


router.route("/register").post(
    upload.fields(
        [
            {name : "avatar",
                maxCount :1
            }
        ]
    ),
    registerUser)

router.route("/login").post(loginUser)


//secured routes    

router.route("/logout").post(verifyJWT,logoutUser)


export default router