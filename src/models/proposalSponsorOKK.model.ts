import mongoose from "mongoose";
import ProposalSponsorOKK from "../interfaces/proposalSponsorOKK.interface";

const ProposalSponsorOKKSchema = new mongoose.Schema({
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SponsorOKK",
        require: true,
        unique: true
    },
    acaraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcaraOKK",
        require: true,
        unique: true
    },
    
    paket: {
        type: String,
        enum: ["Silver", "Gold", "Platinum", null, undefined]
    },
    statusProposal: {
        type: String,
        enum: ["Menunggu Konfirmasi Sponsor", "Ditolak", "Diterima: Silver", "Diterima: Gold", "Diterima: Platinum"]
    }
})

const ProposalSponsorOKKModel =  mongoose.model<ProposalSponsorOKK & mongoose.Document>("ProposalSponsorOKKModel", ProposalSponsorOKKSchema)

export default ProposalSponsorOKKModel