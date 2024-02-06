import express from 'express'
import mongoose, { mongo } from "mongoose";
import * as dotenv from "dotenv";
import userRouter from './routes/user.router';
import courseRouter from './routes/course.router';
import  errorHandler  from './middlewares/error.middleware'
import * as cloudinary from 'cloudinary';
import multer from 'multer';
import gradeRouter from './routes/grade.router';




dotenv.config({ path: __dirname+ '/../.env' });


const app = express()

const upload = multer({ dest: 'uploads/' });

app.use(upload.single('courseImage'));
app.use(express.json())

app.use('/users',userRouter)
app.use("/courses",courseRouter)
app.use("/grades",gradeRouter)

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
