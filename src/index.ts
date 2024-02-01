import express from 'express'
import mongoose, { mongo } from "mongoose";
import * as dotenv from "dotenv";
import userRouter from './routes/user.router';
import  errorHandler  from './middlewares/error.middleware'
dotenv.config({ path: __dirname+ '/../.env' });

const app = express()
app.use(express.json())


app.use('/users',userRouter)

app.use(errorHandler)

const PORT = process.env.PORT

const url = process.env.MONGODB_URL!;

console.log(PORT)
console.log(url)

mongoose.connect(url).then(() =>{
    console.log("DB connected successfully!")
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}!`)
})
