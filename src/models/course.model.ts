import mongoose , {mongo} from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Title field is required!"]
    },
    description: {
        type: String,
        required: [true,"Description field is required!"]
    },
    imageUrl:{
        type: String,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Professor field is required!"],
    },
    students:{
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }},
    {
        timestamps: true
    }
)

const Course = mongoose.model("course",courseSchema)

export default Course