import mongoose from "mongoose"

interface MentorOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    mahasiswaId: mongoose.Schema.Types.ObjectId,

    noKelompok: number
}

export default MentorOKK