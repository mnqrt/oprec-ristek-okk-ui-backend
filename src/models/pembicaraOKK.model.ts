import mongoose from "mongoose";
import PembicaraOKK from "../interfaces/PembicaraOKK.interface";

const pembicaraOKKSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
        unique: true
    },
    
    namaPembicara: {
        type: String,
        require: true,
        unique: true
    },
    listAcaraDiisi: [{
        acara: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
})

const PembicaraOKKModel =  mongoose.model<PembicaraOKK & mongoose.Document>("PembicaraOKKModel", pembicaraOKKSchema)

export default PembicaraOKKModel