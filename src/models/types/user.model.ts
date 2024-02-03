import mongoose , {mongo} from "mongoose";

export interface IUser{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"First Name field is required!"],
    },
    lastName: {
        type: String,
        required: [true,"Last Name field is required!"],
    },
    email:{
        type: String,
        required: [true,"Email field is required!"],
        unique: true
        //TODO : validate email
    },
    password: {
        type: String,
        required: [true,"Password field is required!"],
        minLength: [8,"Password must be at least 8 characters long!"]
    },
    role:{
        type: String,
        enum : ["Student","Professor"],
        default: "Student"
    }},
    {
        timestamps: true
    }
)

const User = mongoose.model("user",userSchema)

export default User