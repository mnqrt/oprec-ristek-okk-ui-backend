import mongoose from "mongoose"

interface MakeMentoringRequestBody {
    passphraseAbsensi: string,
    lokasiMentoring: string,
    materi: string
}

export default MakeMentoringRequestBody