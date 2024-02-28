import mongoose from "mongoose";

interface ProposalSponsorOKK {
    _id: mongoose.Schema.Types.ObjectId,
    sponsorId: mongoose.Schema.Types.ObjectId,
    acaraId: mongoose.Schema.Types.ObjectId,

    paket: string | null | undefined,
    statusProposal: string

    /*
    paket: "Silver" | "Gold" | "Platinum" | null,
    statusProposal: "Menunggu Konfirmasi Sponsor" | "Ditolak" | "Diterima: Silver" | "Diterima: Gold" | "Diterima: Platinum",

    Penjelasan:
    1. Ketika panitia membuat proposal kepada pembicara, awalnya paket = null (karena paket dari sponsor), statusProposal = "Menunggu Konfirmasi Sponsor"
    2. Sponsor yang mendapatkan proposal memiliki 2 pilihan:
        a. Sponsor menolak proposal, maka statusProposal = "Ditolak". Selesai.
        b. Sponsor menerima proposal, maka sponsor akan memilih paket, statusProposal = "Diterima: <paket>"
            , dari sini Sponsor beserta Paket akan dimasukkan kedalam listSponsorBesertaPaket didalam AcaraOKKModel
    */
}

export default ProposalSponsorOKK