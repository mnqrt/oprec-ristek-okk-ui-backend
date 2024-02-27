import mongoose from "mongoose"

interface MentoringOKK {
    _id: mongoose.Schema.Types.ObjectId,
    meetingId: mongoose.Schema.Types.ObjectId,
    noKelompokOKK: number
    
    materi: string
}

export default MentoringOKK