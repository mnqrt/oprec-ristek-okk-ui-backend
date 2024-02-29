import mongoose from "mongoose";

interface ProposalPembicaraOKK {
    _id: mongoose.Schema.Types.ObjectId,
    pembicaraId: mongoose.Schema.Types.ObjectId,
    acaraId: mongoose.Schema.Types.ObjectId,
    materiProposal: string,
    statusProposal: string
}

export default ProposalPembicaraOKK