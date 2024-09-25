import { Request, Response, NextFunction } from "express"

type RequestHandler<T extends Request = Request> = (req: T , res: Response , next: NextFunction) => any;


const asyncHandler =<T extends Request = Request> (requesthandler : RequestHandler<T>) => {
   return (req : T , res : Response , next : NextFunction)=> {
     Promise.resolve(requesthandler(req , res , next))
     .catch((err) => next(err))
    }
}

export {asyncHandler}