import mongoose from "mongoose";

interface ProposalSponsorOKK {
    _id: mongoose.Schema.Types.ObjectId,
    sponsorId: mongoose.Schema.Types.ObjectId,
    acaraId: mongoose.Schema.Types.ObjectId,

    paket: string | null | undefined,
    statusProposal: string
}

export default ProposalSponsorOKK