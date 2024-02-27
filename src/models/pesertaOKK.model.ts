import mongoose from "mongoose";
import PesertaOKK from "../interfaces/pesertaOKK.interface";

const pesertaOKKSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
        unique: true
    },
    mahasiswaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MahasiswaModel',
        require: true,
        unique: true
    },

    noKelompok: {
        type: Number,
        require: true
    },
    jalurMasuk: {
        type: String,
        enum: ["SNBP", "SNBT", "SIMAK", "PPKB", "JAPRES"],
        require: true
    },
})

const PesertaOKKModel =  mongoose.model<PesertaOKK & mongoose.Document>("PesertaOKKModel", pesertaOKKSchema)

export default PesertaOKKModel