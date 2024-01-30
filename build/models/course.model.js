"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title field is required!"]
    },
    description: {
        type: String,
        required: [true, "Description field is required!"]
    },
    imageUrl: {
        type: String,
    },
    professor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Professor field is required!"],
    },
    students: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: []
    }
}, {
    timestamps: true
});
const Course = mongoose_1.default.model("course", courseSchema);
exports.default = Course;
