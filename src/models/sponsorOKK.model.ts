import mongoose from "mongoose";
import { SponsorOKK } from "../interfaces/sponsorOKK.interface";

const sponsorOKKSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
        unique: true
    },
    
    namaSponsor: {
        type: String,
        require: true,
        unique: true
    },
    listAcaraDisponsori: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcaraModel'
    }]
})

const SponsorOKKModel =  mongoose.model<SponsorOKK & mongoose.Document>("SponsorOKKModel", sponsorOKKSchema)

export default SponsorOKKModel