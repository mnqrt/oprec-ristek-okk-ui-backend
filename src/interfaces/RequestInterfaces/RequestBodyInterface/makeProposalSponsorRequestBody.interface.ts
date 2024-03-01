import mongoose from "mongoose";

interface makeProposalSponsorRequestBody {
    acaraId: mongoose.Schema.Types.ObjectId,
    sponsorId: mongoose.Schema.Types.ObjectId
}

export default makeProposalSponsorRequestBody