import mongoose from "mongoose";

interface SponsorOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    
    listAcaraDisponsori: mongoose.Schema.Types.ObjectId[],
    namaSponsor: string
}

interface SponsorOKKBesertaPaket {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    sponsorId: mongoose.Schema.Types.ObjectId,

    paket: string
}

export { SponsorOKK, SponsorOKKBesertaPaket }
