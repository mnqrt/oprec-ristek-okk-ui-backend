import mongoose from "mongoose"

interface PesertaOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    mahasiswaId: mongoose.Schema.Types.ObjectId,

    noKelompok: number,
    jalurMasuk: "SNBP" | "SNBT" | "SIMAK" | "PPKB" | "JAPRES"
}

export default PesertaOKK