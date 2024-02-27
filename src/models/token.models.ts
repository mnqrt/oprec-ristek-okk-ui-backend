import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})

const TokenModel = mongoose.model('TokenModel', tokenSchema)

export default TokenModel