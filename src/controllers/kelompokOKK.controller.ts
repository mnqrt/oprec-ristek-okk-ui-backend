// buat method sehingga mentor bisa bikin model mentoringOKK beserta siapa aja yg ikut
import { Request, Response } from "express";
import { Mongoose } from "mongoose";
import Meeting from "../interfaces/meeting.interface";
import MentoringOKK from "../interfaces/MentoringOKK.interface";
import IsiAbsensiMentoringRequestBody from "../interfaces/RequestInterfaces/isiAbsensiMentoringRequestBody.interface";
import MakeMentoringRequestBody from "../interfaces/RequestInterfaces/makeMentoringRequestBody.interface";
import RequestWithMentor from "../interfaces/RequestInterfaces/requestWithMentor.model";
import RequestWithPeserta from "../interfaces/RequestInterfaces/requestWithPeserta.interface";
import MahasiswaModel from "../models/mahasiswa.models";
import MeetingModel from "../models/meeting.model";
import MentoringOKKModel from "../models/mentoringOKK.model";

const makeMentoringSession = async (req: RequestWithMentor, res: Response) => {
    const { lokasiMentoring, materi, passphraseAbsensi }: MakeMentoringRequestBody = req.body as MakeMentoringRequestBody
    try {
        if (! lokasiMentoring ) return res.sendStatus(404)
        const mahasiswaFromIdMentor = await MahasiswaModel.findById(req.mentor.mahasiswaId)
        if (! mahasiswaFromIdMentor) return res.sendStatus(403)

        const listHadir = [mahasiswaFromIdMentor._id]
        const meeting = new MeetingModel({ tempat: lokasiMentoring, listHadir, passphraseAbsensi })
        await meeting.save()

        const mentoringOKK = new MentoringOKKModel({ meetingId: meeting._id, noKelompokOKK: req.mentor.noKelompok, materi })
        await mentoringOKK.save()

        console.log(meeting.listHadir)

        return res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllMentoringSession = async (req: RequestWithMentor, res: Response) => {
    try {
        res.json(await MentoringOKKModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const isiAbsensiMentoring = async (req: RequestWithPeserta, res: Response) => {
    const { mentoringId, passphraseAbsensi }: IsiAbsensiMentoringRequestBody = req.body as IsiAbsensiMentoringRequestBody
    console.log(req.peserta)
    try {
        if (! mentoringId || ! passphraseAbsensi) return res.sendStatus(404)
        const mentoring = await MentoringOKKModel.findById(mentoringId)
        if (! mentoring) return res.sendStatus(403)
        const meeting = await MeetingModel.findById(mentoring.meetingId)
        if (! meeting) return res.sendStatus(403)
        if(meeting.passphraseAbsensi !== passphraseAbsensi) return res.sendStatus(503)

        console.log("BEFORE :"+meeting)
        
        if (meeting.listHadir.includes(req.peserta.userId)) return res.send("KAMU UDAH ABSENSI, NGAPAIN LAGI?")
        meeting.listHadir.push(req.peserta.userId)
        await meeting.save()
        res.status(201).json(meeting)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeMentoringSession, getAllMentoringSession, isiAbsensiMentoring }
/*
import mongoose, { Mongoose } from "mongoose";
import Meeting from "../interfaces/meeting.interface";

const meetingSchema = new mongoose.Schema({
    tempat: {
        type: String,
        require: true
    },
    waktu: {
        type: Date,
        default: Date.now
    },
    listHadir: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MahasiswaModel',
        require: true
    }]
})

const MeetingModel = mongoose.model<Meeting & mongoose.Document>("MeetingModel", meetingSchema)

export default MeetingModel
*/