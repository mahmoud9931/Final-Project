import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
