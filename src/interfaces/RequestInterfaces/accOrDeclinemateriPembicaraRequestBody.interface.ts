import mongoose from "mongoose";

interface AccOrDeclinemateriPembicaraRequestBody {
    proposalPembicaraId: mongoose.Schema.Types.ObjectId,
    statusProposal: "Diterima Panitia" | "Ditolak Panitia"
}

export default AccOrDeclinemateriPembicaraRequestBody