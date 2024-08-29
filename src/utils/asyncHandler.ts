import { Request, Response, NextFunction } from "express"

type RequestHandler = (req: Request , res: Response , next: NextFunction) => any;


const asyncHandler = (requesthandler : RequestHandler) => {
   return (req : Request , res : Response , next : NextFunction)=> {
     Promise.resolve(requesthandler(req , res , next))
     .catch((err) => next(err))
    }
}

export {asyncHandler}