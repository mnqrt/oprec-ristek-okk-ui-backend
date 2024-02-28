import mongoose from "mongoose";

interface PembicaraOKK {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,

    listAcaraDiisi: mongoose.Schema.Types.ObjectId[],
    namaPembicara: string
}

export default PembicaraOKK