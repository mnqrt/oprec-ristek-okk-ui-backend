import mongoose from "mongoose"

interface MakeRapatRequestBody {
    passphraseAbsensi: string,
    lokasiRapat: string,
    kesimpulanRapat: string
}

export default MakeRapatRequestBody