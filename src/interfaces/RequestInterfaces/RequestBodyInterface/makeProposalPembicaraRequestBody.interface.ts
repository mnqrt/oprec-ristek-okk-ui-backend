import mongoose from "mongoose";

interface makeProposalPembicaraRequestBody {
    acaraId: mongoose.Schema.Types.ObjectId,
    pembicaraId: mongoose.Schema.Types.ObjectId
}

export default makeProposalPembicaraRequestBody