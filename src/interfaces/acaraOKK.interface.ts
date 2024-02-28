import mongoose from "mongoose";

interface AcaraOKK {
    _id: mongoose.Schema.Types.ObjectId,

    namaAcara: string,
    jadwalAcara: Date,
    listSponsorBesertaPaket: any[],
    listPembicaraBesertaMateri: any[]
}

export default AcaraOKK