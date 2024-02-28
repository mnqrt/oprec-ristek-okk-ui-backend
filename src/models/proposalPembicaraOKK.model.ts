import mongoose from "mongoose";
import ProposalPembicaraOKK from "../interfaces/proposalPembicaraOKK.interface";

const proposalPembicaraOKKSchema = new mongoose.Schema({
    pembicaraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PembicaraOKK",
        require: true
    },
    acaraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcaraOKK",
        require: true
    },
    
    materiProposal: {
        type: String
    },
    statusProposal: {
        type: String,
        enum: ["Diterima Panitia", "Diterima Pembicara (Menunggu Konfirmasi Panitia)", "Menunggu Konfirmasi Pembicara", "Ditolak Panitia", "Ditolak Pembicara"]
    }
})

const ProposalPembicaraOKKModel =  mongoose.model<ProposalPembicaraOKK & mongoose.Document>("ProposalPembicaraOKKModel", proposalPembicaraOKKSchema)

export default ProposalPembicaraOKKModel