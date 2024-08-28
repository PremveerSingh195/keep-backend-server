import dotenv from 'dotenv'
import connectDB from "../src/db/index.js";
import { app } from './app.js';

dotenv.config({
    path : './env'
})

Port = process.env.PORT || 3000 

connectDB()
.then(()=> {
    app.listen(Port , (Port)=>{
        console.log(`App is listen on the port${Port}`);
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed !!!" , error);
})