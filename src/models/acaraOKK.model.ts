import mongoose from "mongoose";
import AcaraOKK from "../interfaces/acaraOKK.interface";

const AcaraOKKSchema = new mongoose.Schema({
    namaAcara: {
        type: String,
        require: true,
        unique: true
    },

    jadwalAcara: {
        type: Date,
        require: true
    },
    listSponsorBesertaPaket: [{
        sponsor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SponsorOKKModel"
        },
        paket: {
            type: String,
            enum: ["Silver", "Gold", "Platinum"]
        }
    }],
    listPembicaraBesertaMateri: [{
        pembicaraAcara: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PembicaraOKKModel"
        },
        materi: {
            type: String
        }
    }]
})

const AcaraOKKModel =  mongoose.model<AcaraOKK & mongoose.Document>("AcaraOKKModel", AcaraOKKSchema)

export default AcaraOKKModel