//{ proposalPembicaraId, statusProposal, materi }
import mongoose from "mongoose";

interface ResponProposalPembicaraRequestBody {
    proposalPembicaraId: mongoose.Schema.Types.ObjectId,
    statusProposal: "Diterima Pembicara (Menunggu Konfirmasi Panitia)"  | "Ditolak Pembicara",
    materi: string
}

export default ResponProposalPembicaraRequestBody