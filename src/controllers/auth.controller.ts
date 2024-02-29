import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/user.model'
import RegisterRequestBody from '../interfaces/RequestInterfaces/registerRequestBody.interface'
import MahasiswaModel from '../models/mahasiswa.model'
import MentorOKKModel from '../models/mentorOKK.model'
import MentorOKK from '../interfaces/mentorOKK.interface'
import PanitiaOKKModel from '../models/panitiaOKK.model'
import PesertaOKKModel from '../models/pesertaOKK.model'
import LoginRequestBody from '../interfaces/RequestInterfaces/loginRequestBody.interface'
import TokenModel from '../models/token.models'
import User from '../interfaces/user.interface'
import PesertaOKK from '../interfaces/pesertaOKK.interface'
import PanitiaOKK from '../interfaces/panitiaOKK.interface'
import MeetingModel from '../models/meeting.model'
import RapatOKKModel from '../models/rapatOKK.model'
import MentoringOKKModel from '../models/mentoringOKK.model'
import SponsorOKKModel from '../models/sponsorOKK.model'
import PembicaraOKKModel from '../models/pembicaraOKK.model'
import { SponsorOKK } from '../interfaces/sponsorOKK.interface'
import AcaraOKKModel from '../models/acaraOKK.model'
import ProposalSponsorOKKModel from '../models/proposalSponsorOKK.model'
import ProposalPembicaraOKKModel from '../models/proposalPembicaraOKK.model'
import RequestWithUser from '../interfaces/RequestInterfaces/requestWithUser.interface'

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

interface Id {
    id: string,
    iat: any,
    exp: any
}

const register = async (req: Request, res: Response) => {
    try {
        const { username,
                password, 
                loginAs, 
                nama, 
                fakultas, 
                jurusan, 
                angkatan, 
                noKelompok, 
                jalurMasuk, 
                tipePengurus, 
                bidangTerkait, 
                jabatan,
                namaSponsor,
                namaPembicara }: RegisterRequestBody = req.body as RegisterRequestBody

        if (! ["Peserta", "Mentor", "Panitia", "Sponsor", "Pembicara"].includes(loginAs)) {
            return res.status(404).json({ message: "Role Yang Dipilih Tidak Valid." })
        }

        // Hash Password dan buat User baru
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ username, password: hashedPassword, role: loginAs })
        const userId = newUser._id

        if (["Peserta", "Mentor", "Panitia"].includes(loginAs)) {
            if (nama        === undefined) return res.sendStatus(404)
            if (fakultas    === undefined) return res.sendStatus(404)
            if (jurusan     === undefined) return res.sendStatus(404)
            if (angkatan    === undefined) return res.sendStatus(404)
            const newMahasiswa = new MahasiswaModel({ userId, nama, fakultas, jurusan, angkatan })
            await newMahasiswa.save()
            const mahasiswaId = newMahasiswa._id

            if (loginAs === "Mentor") {
                if (noKelompok === undefined) return res.sendStatus(404)
                const newMentor = new MentorOKKModel({ userId, mahasiswaId, noKelompok})
                await newMentor.save()
            }
            if (loginAs === "Panitia") {
                if (tipePengurus    === undefined) return res.sendStatus(404)
                if (bidangTerkait   === undefined) return res.sendStatus(404)
                if (jabatan         === undefined) return res.sendStatus(404)
                const newPanitia = new PanitiaOKKModel({ userId, mahasiswaId, tipePengurus, bidangTerkait, jabatan })
                await newPanitia.save()
            }
            if (loginAs === "Peserta") {
                if (jalurMasuk === undefined) return res.sendStatus(404)
                if (noKelompok === undefined) return res.sendStatus(404)
                const newPeserta = new PesertaOKKModel({ userId, mahasiswaId, jalurMasuk, noKelompok })
                await newPeserta.save()
            }
            await newUser.save()
            return res.sendStatus(201)
        }
        if (loginAs === "Sponsor") {
            if (! namaSponsor) return res.sendStatus(404)
            const sponsor = new SponsorOKKModel({ userId, namaSponsor, listAcaraDisponsori: [] })
            await sponsor.save()
            await newUser.save()
            return res.sendStatus(201)
        }
        if (loginAs === "Pembicara") {
            if (! namaPembicara) return res.sendStatus(404)
            const pembicara = new PembicaraOKKModel({ userId, namaPembicara, listAcaraDiisi: [] })
            await pembicara.save()
            await newUser.save()
            return res.sendStatus(201)
        }
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password }: LoginRequestBody = req.body as LoginRequestBody
    try {
        const user = await UserModel.findOne({ username })
        if (! user) return res.sendStatus(404)
        if (! (await bcrypt.compare(password, user.password))) return res.sendStatus(401)

        const userIdObject = { id: user._id }
        const accessToken = jwt.sign(userIdObject, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(userIdObject, REFRESH_TOKEN_SECRET, {expiresIn: '60m' })

        res.cookie("ACCESS_TOKEN_USER", accessToken)
        res.cookie("REFRESH_TOKEN_USER", refreshToken)

        const newToken = new TokenModel({ userId: user._id, refreshToken })
        await newToken.save()

        res.status(200).json({ accessToken, refreshToken })
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const logout = async (req: RequestWithUser, res: Response) => {
    try {
        await TokenModel.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllMentor = async (req: Request, res: Response) => {
    try {
        const allMentor = await MentorOKKModel.find({})
        const allMentorWithMoreInfo = await Promise.all(allMentor.map(async (mentor: MentorOKK) => {
            const mahasiswaFromMentor = await MahasiswaModel.findById(mentor.mahasiswaId)
            return { dataMahasiswa: mahasiswaFromMentor, dataMentor: mentor}
        }))
        return res.status(200).json(allMentorWithMoreInfo)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllPeserta = async (req: Request, res: Response) => {
    try {
        const allPeserta = await PesertaOKKModel.find({})
        const allPesertaWithMoreInfo = await Promise.all(allPeserta.map(async (peserta: PesertaOKK) => {
            const mahasiswaFromPeserta = await MahasiswaModel.findById(peserta.mahasiswaId)
            return { dataMahasiswa: mahasiswaFromPeserta, dataMentor: peserta}
        }))
        return res.status(200).json(allPesertaWithMoreInfo)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllSponsor = async (req: Request, res: Response) => {
    try {
        const allSponsor = await SponsorOKKModel.find({})
        return res.status(200).json(allSponsor)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllPembicara = async (req: Request, res: Response) => {
    try {
        const allPembicara = await PembicaraOKKModel.find({})
        return res.status(200).json(allPembicara)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllPanitia = async (req: Request, res: Response) => {
    try {
        const allPanitia = await PanitiaOKKModel.find({})
        const allPanitiaWithMoreInfo = await Promise.all(allPanitia.map(async (panitia: PanitiaOKK) => {
            const mahasiswaFromPanitia = await MahasiswaModel.findById(panitia.mahasiswaId)
            return { dataMahasiswa: mahasiswaFromPanitia, dataMentor: panitia}
        }))
        return res.status(200).json(allPanitiaWithMoreInfo)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteAll = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
    try {
        await UserModel.deleteMany({})
        await MahasiswaModel.deleteMany({})
        await MentorOKKModel.deleteMany({})
        await PanitiaOKKModel.deleteMany({})
        await PesertaOKKModel.deleteMany({})
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteAllToken = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
    try {
        await TokenModel.deleteMany({})
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteAllMeeting = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
    try {
        await MeetingModel.deleteMany({})
        await RapatOKKModel.deleteMany({})
        await MentoringOKKModel.deleteMany({})
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteAllSponsor_Pembicara_Acara_Proposal = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
    try {
        await SponsorOKKModel.deleteMany({})
        await PembicaraOKKModel.deleteMany({})
        await AcaraOKKModel.deleteMany({})
        await ProposalSponsorOKKModel.deleteMany({})
        await ProposalPembicaraOKKModel.deleteMany({})
        await MahasiswaModel.deleteMany({})
        await MeetingModel.deleteMany({})

        await MentorOKKModel.deleteMany({})
        await PanitiaOKKModel.deleteMany({})
        await PesertaOKKModel.deleteMany({})
        
        await RapatOKKModel.deleteMany({})
        await UserModel.deleteMany({})
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const generateToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['REFRESH_TOKEN_USER']
    if(! refreshToken) return res.sendStatus(401)
    if(! (await TokenModel.findOne({ refreshToken }))) return res.sendStatus(403)

    try {
        const idObject = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as Id 
        const user: User | null = await UserModel.findById(idObject.id)
        if (! user) return res.sendStatus(403)

        const accessToken = jwt.sign({ id: idObject }, ACCESS_TOKEN_SECRET, { expiresIn: '15m'})

        res.cookie("ACCESS_TOKEN_USER", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        })

        res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { register, login, logout, deleteAll, generateToken, deleteAllToken, getAllMentor, getAllPeserta, getAllPanitia, deleteAllMeeting, getAllSponsor, getAllPembicara, deleteAllSponsor_Pembicara_Acara_Proposal }