import express from 'express'
// import usersRouter from './routes/user.router'
// import taskRouters from './routes/task.router'
import mongoose, { mongo } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+ '/../.env' });

const app = express()
app.use(express.json())

console.log("HERE ROUTERS")
// app.use('/users',usersRouter)
// app.use('/tasks',taskRouters)

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