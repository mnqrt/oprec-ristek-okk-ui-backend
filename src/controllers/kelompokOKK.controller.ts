// buat method sehingga mentor bisa bikin model mentoringOKK beserta siapa aja yg ikut
import { Request, Response } from "express";
import { Mongoose } from "mongoose";
import Meeting from "../interfaces/meeting.interface";
import MentoringOKK from "../interfaces/MentoringOKK.interface";
import IsiAbsensiMentoringRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/isiAbsensiMentoringRequestBody.interface";
import MakeMentoringRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/makeMentoringRequestBody.interface";
import RequestWithMentor from "../interfaces/RequestInterfaces/requestWithMentor.model";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import RequestWithPeserta from "../interfaces/RequestInterfaces/requestWithPeserta.interface";
import MahasiswaModel from "../models/mahasiswa.model";
import MeetingModel from "../models/meeting.model";
import MentoringOKKModel from "../models/mentoringOKK.model";

const makeMentoringSession = async (req: RequestWithMentor, res: Response) => {
    const { lokasiMentoring, materi, passphraseAbsensi }: MakeMentoringRequestBody = req.body as MakeMentoringRequestBody
    try {
        if (! lokasiMentoring || ! materi ) return res.status(404).send("lokasiMentoring dan materi harus diisi!")
        const mahasiswaFromIdMentor = await MahasiswaModel.findById(req.mentor.mahasiswaId)
        if (! mahasiswaFromIdMentor) return res.sendStatus(403)

        const listHadir = [mahasiswaFromIdMentor._id]
        const meeting = new MeetingModel({ tempat: lokasiMentoring, listHadir, passphraseAbsensi })
        await meeting.save()

        const mentoringOKK = new MentoringOKKModel({ meetingId: meeting._id, noKelompokOKK: req.mentor.noKelompok, materi })
        await mentoringOKK.save()

        return res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllMentoringSession = async (req: RequestWithPanitia, res: Response) => {
    try {
        const allMentoring = await MentoringOKKModel.find({})

        const allMentoringWithAdditionalInfo = await Promise.all(allMentoring.map(async (mentoring: MentoringOKK) => {
            const meeting = await MeetingModel.findById(mentoring.meetingId)
            return { mentoring, meeting }
        }))
        res.json(allMentoringWithAdditionalInfo)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getMentoringSessionByMentor = async (req: RequestWithMentor, res: Response) => {
    try {
        const allMentoringByMentor = await MentoringOKKModel.find({ noKelompokOKK: req.mentor.noKelompok })

        const allMentoringByMentorWithAdditionalInfo = await Promise.all(allMentoringByMentor.map(async (mentoring: MentoringOKK) => {
            const meetingByMentoring = await MeetingModel.findById(mentoring.meetingId)
            return { mentoring, meeting: meetingByMentoring }
        }))
        res.json(allMentoringByMentorWithAdditionalInfo)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const isiAbsensiMentoring = async (req: RequestWithPeserta, res: Response) => {
    const { mentoringId, passphraseAbsensi }: IsiAbsensiMentoringRequestBody = req.body as IsiAbsensiMentoringRequestBody
    try {
        if (! mentoringId || ! passphraseAbsensi) return res.status(404).send("mentoringId dan passphraseAbsensi tidak boleh kosong!")
        const mentoring = await MentoringOKKModel.findById(mentoringId)
        if (! mentoring) return res.status(403).send(`tidak ditemukan mentoring dengan id ${mentoringId}!`)
        const meeting = await MeetingModel.findById(mentoring.meetingId)
        if (! meeting) return res.status(403).send(`tidak ditemukan meeting yang bersangkutan!`)
        if (req.peserta.noKelompok !== mentoring.noKelompokOKK) return res.status(403).send("kelompok anda tidak sesuai")
        if (meeting.passphraseAbsensi !== passphraseAbsensi) return res.status(403).send("passphraseAbsensi tidak sesuai")

        
        if (meeting.listHadir.includes(req.peserta.userId)) return res.status(400).send("Anda hanya dapat mengisi absensi sebanyak 1 kali.")
        meeting.listHadir.push(req.peserta.userId)
        await meeting.save()
        res.status(201).json(meeting)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteMentoringById = async (req: RequestWithMentor, res: Response) => {
    try {
        const mentoringId = req.params.mentoringId
        const meetingId = (await MentoringOKKModel.findById(mentoringId))?.meetingId
        await MentoringOKKModel.findOneAndDelete({ _id: mentoringId })
        await MeetingModel.findOneAndDelete({ _id: meetingId })
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeMentoringSession, getAllMentoringSession, getMentoringSessionByMentor, isiAbsensiMentoring, deleteMentoringById }