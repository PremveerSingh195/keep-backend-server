import dotenv from 'dotenv'
import connectDB from "./db/index.ts";
import { app } from './app.ts';

dotenv.config({
    path : './env'
})

const Port  = process.env.PORT  || 3000 

connectDB()
.then(()=> {
    app.listen(Port , (Port)=>{
        console.log(`App is listen on the port${Port}`);
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed !!!" , error);
})