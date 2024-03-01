// buat method sehingga panitia bisa bikin model rapatOKK beserta siapa aja yg ikut
import { Response } from "express";
import IsiAbsensiRapatRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/IsiAbsensiRapatRequestBody.interface";
import MakeRapatRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/makeRapatRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import MahasiswaModel from "../models/mahasiswa.model";
import MeetingModel from "../models/meeting.model";
import RapatOKKModel from "../models/rapatOKK.model";

const makeRapatSession = async (req: RequestWithPanitia, res: Response) => {
    const { lokasiRapat, kesimpulanRapat, passphraseAbsensi }: MakeRapatRequestBody = req.body as MakeRapatRequestBody
    try {
        if (! lokasiRapat || ! kesimpulanRapat) return res.status(404).send("lokasiRapat dan kesimpulanRapat harus diisi!")
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
    try {
        if (! rapatId || ! passphraseAbsensi) return res.status(404).send("rapatId dan passphraseAbsensi tidak boleh kosong!")
        const rapat = await RapatOKKModel.findById(rapatId)
        if (! rapat) return res.status(403).send(`tidak ditemukan rapat dengan id ${rapatId}`)
        const meeting = await MeetingModel.findById(rapat.meetingId)
        if (! meeting) return res.status(403).send(`tidak ditemukan meeting yang bersangkutan`)
        if(meeting.passphraseAbsensi !== passphraseAbsensi) return res.status(503).send("passphraseAbsensi tidak sesuai")
        
        if (meeting.listHadir.includes(req.panitia.userId)) return res.status(400).send("Anda hanya dapat mengisi absensi sebanyak 1 kali.")
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