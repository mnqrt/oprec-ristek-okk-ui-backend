import mongoose from "mongoose";

interface ResponDariSponsorRequestBody {
    proposalSponsorId: mongoose.Schema.Types.ObjectId,
    statusProposal: "Menunggu Konfirmasi Sponsor" | "Ditolak" | "Diterima: Silver" | "Diterima: Gold" | "Diterima: Platinum",
    paket?: "Silver" | "Gold" | "Platinum" | undefined 
}

export default ResponDariSponsorRequestBody