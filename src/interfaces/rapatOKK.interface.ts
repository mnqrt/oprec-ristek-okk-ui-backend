import mongoose from "mongoose"

interface RapatOKK {
    _id: mongoose.Schema.Types.ObjectId,
    meetingId: mongoose.Schema.Types.ObjectId,
    
    kesimpulanRapat: string,
    bidangTerkaitRapat: string
}

export default RapatOKK