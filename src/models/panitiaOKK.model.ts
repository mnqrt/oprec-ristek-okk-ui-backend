import mongoose from "mongoose";
import PanitiaOKK from "../interfaces/panitiaOKK.interface";

const panitiaOKKSchema = new mongoose.Schema({
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

    tipePengurus: {
        type: String,
        enum: ["PI", "BPH"],
        require: true
    },
    bidangTerkait: {
        type: String,
        enum: [null, "PO", "VPO", "Sekretaris Umum", "Controller", "Treasurer", "Koordinator Acara", "Koordinator Mentor"] 
    },
    jabatan: {
        type: String,
        enum: [null, "Penanggung Jawab", "Wakil Penanggung Jawab"]
    },
})

const PanitiaOKKModel =  mongoose.model<PanitiaOKK & mongoose.Document>("PanitiaOKKModel", panitiaOKKSchema)

export default PanitiaOKKModel