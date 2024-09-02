class ApiError extends Error {

    statusCode: number;
    data: any; 
    message: string;
    success: boolean;
    errors: any[]; 
    stack: any;

    constructor(
        statusCode : number ,
        message : string="Something went wrong",
        errors : any=[],
        stack : any =""
    ){
        super(message)
        this.statusCode = statusCode
        this.data
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}