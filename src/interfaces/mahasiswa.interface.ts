import mongoose from "mongoose"

interface Mahasiswa {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    
    nama: string,
    fakultas: string,
    jurusan: string,
    angkatan: number
}

export default Mahasiswa