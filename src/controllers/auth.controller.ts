import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/user.model'
import RegisterRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/registerRequestBody.interface'
import MahasiswaModel from '../models/mahasiswa.model'
import MentorOKKModel from '../models/mentorOKK.model'
import MentorOKK from '../interfaces/mentorOKK.interface'
import PanitiaOKKModel from '../models/panitiaOKK.model'
import PesertaOKKModel from '../models/pesertaOKK.model'
import LoginRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/loginRequestBody.interface'
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
import ChangePasswordRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/changePasswordRequestBody.interface'

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

const BIDANG_PI = ["PO", "VPO", "Sekretaris Umum", "Controller", "Treasurer", "Koordinator Acara", "Koordinator Mentor", 
                    ,"Koordinator bidang Acara", "Sarana dan Prasarana", "Operasional", "Materi dan Mentor", "Kreatif", "Relasi"]
const BIDANG_BPH = ["Project", "Sponsorship", "Kesekretariatan", "PSDM", "Acara Puncak", "Eksplorasi", "Transportasi dan Konsumsi", 
                    "Perizinan", "Logistik", "Keamanan", "Medis", "Media Informasi", "Kelembagaan", "Materi", "Mentor", 
                    "Media Partner", "IT dan Broadcast", "Dekorasi dan Wardrobe", "Visual Design dan Dokumentasi"]

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
            if (nama        === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta, Mentor, atau Panitia; nama tidak boleh kosong!")
            if (fakultas    === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta, Mentor, atau Panitia; fakultas tidak boleh kosong!")
            if (jurusan     === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta, Mentor, atau Panitia; jurusan tidak boleh kosong!")
            if (angkatan    === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta, Mentor, atau Panitia; angkatan tidak boleh kosong!")
            const newMahasiswa = new MahasiswaModel({ userId, nama, fakultas, jurusan, angkatan })
            await newMahasiswa.save()
            const mahasiswaId = newMahasiswa._id

            if (loginAs === "Mentor") {
                if (noKelompok === undefined) return res.status(404).send("Jika mendaftar sebagai Mentor; noKelompok tidak boleh kosong!")
                const newMentor = new MentorOKKModel({ userId, mahasiswaId, noKelompok})
                await newMentor.save()
            }
            if (loginAs === "Panitia") {
                if (tipePengurus    === undefined) return res.status(404).send("Jika mendaftar sebagai Panitia; tipePengurus tidak boleh kosong!")
                if (bidangTerkait   === undefined) return res.status(404).send("Jika mendaftar sebagai Panitia; bidangTerkait tidak boleh kosong!")
                if (jabatan         === undefined) return res.status(404).send("Jika mendaftar sebagai Panitia; jabatan tidak boleh kosong!")

                if (tipePengurus === "PI" && ! BIDANG_PI.includes(bidangTerkait)) return res.status(403).send("bidangTerkait tidak ada di PI")
                if (tipePengurus === "BPH" && ! BIDANG_BPH.includes(bidangTerkait)) return res.status(403).send("bidangTerkait tidak ada di BPH")

                if (tipePengurus === "BPH") {
                    if (jabatan === "Penanggung Jawab" &&
                        await PanitiaOKKModel.countDocuments({ bidangTerkait, jabatan}) >= 1)   
                            return res.status(403).send(`Banyak Penanggung Jawab pada bidang ${bidangTerkait} maksimal 1.`)
                    if (jabatan === "Wakil Penanggung Jawab" &&
                        await PanitiaOKKModel.countDocuments({ bidangTerkait, jabatan}) >= 2)
                            return res.status(403).send(`Banyak Wakil Penanggung Jawab pada bidang ${bidangTerkait} maksimal 2.`)
                }

                const newPanitia = new PanitiaOKKModel({ userId, mahasiswaId, tipePengurus, bidangTerkait, jabatan })
                await newPanitia.save()
            }
            if (loginAs === "Peserta") {
                if (jalurMasuk === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta; jalurMasuk tidak boleh kosong!")
                if (noKelompok === undefined) return res.status(404).send("Jika mendaftar sebagai Peserta; noKelompok tidak boleh kosong!")
                const newPeserta = new PesertaOKKModel({ userId, mahasiswaId, jalurMasuk, noKelompok })
                await newPeserta.save()
            }
            await newUser.save()
            return res.sendStatus(201)
        }
        if (loginAs === "Sponsor") {
            if (! namaSponsor) return res.status(404).send("Jika mendaftar sebagai Sponsor; namaSponsor tidak boleh kosong!")
            const sponsor = new SponsorOKKModel({ userId, namaSponsor, listAcaraDisponsori: [] })
            await sponsor.save()
            await newUser.save()
            return res.sendStatus(201)
        }
        if (loginAs === "Pembicara") {
            if (! namaPembicara) return res.status(404).send("Jika mendaftar sebagai Pembicara; namaPembicara tidak boleh kosong!")
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
        if (! username || ! password) return res.status(404).send("username dan password tidak boleh kosong!")
        const user = await UserModel.findOne({ username })
        if (! user) return res.status(404).send(`tidak ditemukan user dengan username ${username}`)
        if (! (await bcrypt.compare(password, user.password))) return res.status(401).send("password tidak sesuai!")

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

const logout = async (req: Request, res: Response) => {
    try {
        console.log(req.cookies['REFRESH_TOKEN_USER'])
        await TokenModel.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
        await TokenModel.deleteMany({})
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
        res.status(204).send("Berhasil logout")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const changePassword = async (req: RequestWithUser, res: Response) => {
    const { password, newPassword }: ChangePasswordRequestBody = req.body as ChangePasswordRequestBody
    try {
        const user = await UserModel.findById(req.user._id)
        if (! user) return res.sendStatus(404)
        if (! (await bcrypt.compare(password, user.password))) return res.status(401).send("password tidak sesuai!")
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.status(204).send("Password berhasil diubah!")
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
            return { dataMahasiswa: mahasiswaFromPeserta, dataPeserta: peserta}
        }))
        return res.status(200).json(allPesertaWithMoreInfo)
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
            return { dataMahasiswa: mahasiswaFromPanitia, dataPanitia: panitia}
        }))
        return res.status(200).json(allPanitiaWithMoreInfo)
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

const deleteAllToken = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
    try {
        await TokenModel.deleteMany({})
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
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

const deleteAll = async (req: Request, res: Response) => { //ONLY USE THIS WHEN WRONG DATA OCCUR
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
        await MentoringOKKModel.deleteMany({})
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

export { register, login, logout, changePassword, generateToken, deleteAllToken, getAllMentor, getAllPeserta, getAllPanitia, deleteAllMeeting, getAllSponsor, getAllPembicara, deleteAll }