import mongoose from "mongoose"

interface User {
    _id: mongoose.Schema.Types.ObjectId,
    username: string,
    password: string,
    role: "Peserta" | "Mentor" | "Panitia" | "Sponsor" | "Pembicara"
}

export default User