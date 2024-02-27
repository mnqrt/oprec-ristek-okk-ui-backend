import mongoose from "mongoose";
import MentorOKK from "../interfaces/mentorOKK.interface";

const mentorOKKSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
        unique: true
    },
    mahasiswaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MahasiswaModel',
        require: true,
        unique: true
    },
    
    noKelompok: {
        type: Number,
        require: true,
        unique: true
    }
})

const MentorOKKModel =  mongoose.model<MentorOKK & mongoose.Document>("MentorOKKModel", mentorOKKSchema)

export default MentorOKKModel