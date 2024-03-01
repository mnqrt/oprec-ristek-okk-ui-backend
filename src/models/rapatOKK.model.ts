import mongoose, { Mongoose } from "mongoose";
import RapatOKK from "../interfaces/rapatOKK.interface";

const rapatOKKSchema = new mongoose.Schema({
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },

    kesimpulanRapat: {
        type: String,
        require: true
    },
    bidangTerkaitRapat: {
        type: String
    }
})

const RapatOKKModel = mongoose.model<RapatOKK & mongoose.Document>("RapatOKKModel", rapatOKKSchema)

export default RapatOKKModel