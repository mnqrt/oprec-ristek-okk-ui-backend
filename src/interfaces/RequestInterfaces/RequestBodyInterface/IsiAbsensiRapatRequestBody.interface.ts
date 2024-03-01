import mongoose from "mongoose";

interface IsiAbsensiRapatRequestBody {
    rapatId: mongoose.Schema.Types.ObjectId,
    passphraseAbsensi: string
}

export default IsiAbsensiRapatRequestBody