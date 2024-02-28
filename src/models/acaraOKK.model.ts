/*
import mongoose from "mongoose";

interface AcaraOKK {
    _id: mongoose.Schema.Types.ObjectId,

    namaAcara: string,
    jadwalAcara: Date,
    listSponsorBesertaPaket: mongoose.Schema.Types.ObjectId,
    listPembicara: mongoose.Schema.Types.ObjectId
}

export default AcaraOKK
*/
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
    listPembicaraBesertaPaket: [{
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