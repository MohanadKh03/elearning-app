import mongoose , {mongo} from "mongoose";

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Student field is required!"],
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Course field is required!"],
    },
    grade:{
        type : Number,
        required: [true,"Grade field is required!"],
        min: [0,"Grade must be at least 0!"],
        max: [100,"Grade must be at most 100!"]
    },
    feedback: {
        type: String,
    }},
    {
        timestamps: true
    }
)

const Grade = mongoose.model("grade",gradeSchema)

export default Grade