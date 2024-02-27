import mongoose, { Mongoose } from "mongoose";
import Meeting from "../interfaces/meeting.interface";

const meetingSchema = new mongoose.Schema({
    passphraseAbsensi: {
        type: String,
        require: true
    },
    tempat: {
        type: String,
        require: true
    },
    waktu: {
        type: Date,
        default: Date.now
    },
    listHadir: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MahasiswaModel',
        require: true
    }]
})

const MeetingModel = mongoose.model<Meeting & mongoose.Document>("MeetingModel", meetingSchema)

export default MeetingModel