import mongoose from "mongoose";
import User from "../interfaces/user.interface";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String
    }
})

const UserModel = mongoose.model<User & mongoose.Document>('UserModel', userSchema)

export default UserModel