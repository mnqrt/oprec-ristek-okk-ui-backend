import mongoose from "mongoose"

interface KelompokOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userMentorId: mongoose.Schema.Types.ObjectId,
    mahasiswaMentorId: mongoose.Schema.Types.ObjectId,

    noKelompok: number,
    listAnggotaKelompokId: mongoose.Schema.Types.ObjectId[],
    listPertemuanKelompokId: mongoose.Schema.Types.ObjectId[],
}

export default KelompokOKK