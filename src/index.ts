import dotenv from 'dotenv'
import connectDB from "./db/index";
import { app } from './app';

dotenv.config({
    path : './.env'
})

const Port : number = parseInt(process.env.PORT  || '3000' , 10) 

connectDB()
.then(()=> {
    app.listen(Port , ()=>{
        console.log(`App is listen on the port : ${Port}`);
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed !!!" , error);
})