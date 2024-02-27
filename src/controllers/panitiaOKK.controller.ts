// buat method sehingga panitia bisa bikin model rapatOKK beserta siapa aja yg ikut
import { Response } from "express";
import IsiAbsensiRapatRequestBody from "../interfaces/RequestInterfaces/IsiAbsensiRapatRequestBody.interface";
import MakeRapatRequestBody from "../interfaces/RequestInterfaces/makeRapatRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import MahasiswaModel from "../models/mahasiswa.models";
import MeetingModel from "../models/meeting.model";
import RapatOKKModel from "../models/rapatOKK.model";

const makeRapatSession = async (req: RequestWithPanitia, res: Response) => {
    const { lokasiRapat, kesimpulanRapat, passphraseAbsensi }: MakeRapatRequestBody = req.body as MakeRapatRequestBody
    try {
        if (! lokasiRapat) return res.sendStatus(404)
        const mahasiswaFromIdPanitia = await MahasiswaModel.findById(req.panitia.mahasiswaId)
        if (! mahasiswaFromIdPanitia) return res.sendStatus(403)

        const listHadir = [mahasiswaFromIdPanitia._id]
        const meeting = new MeetingModel({ tempat: lokasiRapat, listHadir, passphraseAbsensi })
        await meeting.save()

        const rapatOKK = new RapatOKKModel({ meetingId: meeting._id, kesimpulanRapat })
        await rapatOKK.save()

        return res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllRapatSession = async (req: RequestWithPanitia, res: Response) => {
    try{
        res.json(await RapatOKKModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const isiAbsensiRapat = async (req: RequestWithPanitia, res: Response) => {
    const { rapatId, passphraseAbsensi }: IsiAbsensiRapatRequestBody = req.body as IsiAbsensiRapatRequestBody
    console.log(req.panitia)
    try {
        if (! rapatId || ! passphraseAbsensi) return res.sendStatus(404)
        const rapat = await RapatOKKModel.findById(rapatId)
        if (! rapat) return res.sendStatus(403)
        const meeting = await MeetingModel.findById(rapat.meetingId)
        if (! meeting) return res.sendStatus(403)
        if(meeting.passphraseAbsensi !== passphraseAbsensi) return res.sendStatus(503)
        
        if (meeting.listHadir.includes(req.panitia.userId)) return res.send("KAMU UDAH ABSENSI, NGAPAIN LAGI?")
        meeting.listHadir.push(req.panitia.userId)
        await meeting.save()
        res.status(201).json(meeting)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeRapatSession, getAllRapatSession, isiAbsensiRapat }