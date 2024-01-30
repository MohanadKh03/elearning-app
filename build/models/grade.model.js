"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gradeSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Student field is required!"],
    },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Course field is required!"],
    },
    grade: {
        type: Number,
        required: [true, "Grade field is required!"],
        min: [0, "Grade must be at least 0!"],
        max: [100, "Grade must be at most 100!"]
    },
    feedback: {
        type: String,
    }
}, {
    timestamps: true
});
const Grade = mongoose_1.default.model("grade", gradeSchema);
exports.default = Grade;
