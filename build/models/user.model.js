"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "First Name field is required!"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name field is required!"],
    },
    email: {
        type: String,
        required: [true, "Email field is required!"],
        unique: true
        //TODO : validate email
    },
    password: {
        type: String,
        required: [true, "Password field is required!"],
        minLength: [8, "Password must be at least 8 characters long!"]
    },
    role: {
        type: String,
        enum: ["Student", "Professor"],
        default: "Student"
    }
}, {
    timestamps: true
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
