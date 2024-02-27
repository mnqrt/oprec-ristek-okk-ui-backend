import mongoose from "mongoose"

interface PanitiaOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    mahasiswaId: mongoose.Schema.Types.ObjectId,

    tipePengurus: string,
    bidangTerkait: string, //nanti lanjutin ini, kebanyakan
    jabatan: string,
}

export default PanitiaOKK