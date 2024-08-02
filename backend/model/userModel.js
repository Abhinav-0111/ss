import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            max: 20,
            min: 4,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePhoto: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
        },
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
