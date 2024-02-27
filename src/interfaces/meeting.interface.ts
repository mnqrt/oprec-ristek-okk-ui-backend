import mongoose from "mongoose"

interface Meeting {
    _id: mongoose.Schema.Types.ObjectId,
    
    passphraseAbsensi: string,
    tempat: string,
    waktu: Date,
    listHadir: mongoose.Schema.Types.ObjectId[]
}

export default Meeting