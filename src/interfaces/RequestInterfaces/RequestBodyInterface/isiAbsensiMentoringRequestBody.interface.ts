import mongoose from "mongoose";

interface IsiAbsensiMentoringRequestBody {
    mentoringId: mongoose.Schema.Types.ObjectId,
    passphraseAbsensi: string
}

export default IsiAbsensiMentoringRequestBody