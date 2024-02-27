import mongoose, { Mongoose } from "mongoose";
import MentoringOKK from "../interfaces/MentoringOKK.interface";

const mentoringOKKSchema = new mongoose.Schema({
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    noKelompokOKK: {
        type: Number
    },

    materi: {
        type: String,
        require: true
    }
})

const MentoringOKKModel = mongoose.model<MentoringOKK & mongoose.Document>("MentoringOKKModel", mentoringOKKSchema)

export default MentoringOKKModel