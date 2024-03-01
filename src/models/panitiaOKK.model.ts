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
        enum: ["PO", "VPO", "Sekretaris Umum", "Controller", "Treasurer", "Koordinator Acara", "Koordinator Mentor", 
                ,"Koordinator bidang Acara", "Sarana dan Prasarana", "Operasional", "Materi dan Mentor", "Kreatif", "Relasi",
            
                "Project", "Sponsorship", "Kesekretariatan", "PSDM", "Acara Puncak", "Eksplorasi", "Transportasi dan Konsumsi", 
                "Perizinan", "Logistik", "Keamanan", "Medis", "Media Informasi", "Kelembagaan", "Materi", "Mentor", 
                "Media Partner", "IT dan Broadcast", "Dekorasi dan Wardrobe", "Visual Design dan Dokumentasi"]
    },
    jabatan: {
        type: String,
        enum: ["PI", "Penanggung Jawab", "Wakil Penanggung Jawab", "Staff"]
    },
})

const PanitiaOKKModel =  mongoose.model<PanitiaOKK & mongoose.Document>("PanitiaOKKModel", panitiaOKKSchema)

export default PanitiaOKKModel