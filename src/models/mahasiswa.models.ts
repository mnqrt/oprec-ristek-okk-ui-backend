import mongoose from "mongoose";
import Mahasiswa from "../interfaces/mahasiswa.interface";

const mahasiswaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
        unique: true
    },
    
    nama: {
        type: String,
        require: true
    },
    fakultas: {
        type: String
    },
    jurusan: {
        type: String
    },
    angkatan: {
        type: Number
    }
})

const MahasiswaModel =  mongoose.model<Mahasiswa & mongoose.Document>("MahasiswaModel", mahasiswaSchema)

export default MahasiswaModel