import mongoose , {Schema , Document , ObjectId} from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs";


export interface IUser extends Document {
    userName : string;
    email : string;
    Fullname : string;
    avatar  :string;
    password : string;
    refreshtoken? : string ;
    isPasswordCorrect (password : string) : Promise<boolean>;
    _id : ObjectId;
    generateAccessToken() : string
    generateRefreshToken() : string
}

const userSchema = new Schema<IUser>(
    {
   userName  : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
    index : true
   } ,
   email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true
   } ,
   Fullname : {
    type : String,
    required : true,
    trim : true,
    index : true
   },
   avatar : {
    type : String,
    required : true
   },
   password : {
    type : String,
    required : [true , 'Password is required']
   },
   refreshtoken : {
    type :String
   }
 },
 {
    timestamps:true
 }
)

userSchema.pre<IUser>("save" ,async function (next) {
    if(!this.isModified("password")) return next();
     this.password = await bcryptjs.hash(this.password , 10)
     next()
})

userSchema.methods.isPasswordCorrect = async function (password : string) : Promise<boolean> {
  return await bcryptjs.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

   return jwt.sign(
        {
            _id : this._id, 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm: 'HS256',
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){

    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model<IUser>("User" , userSchema)