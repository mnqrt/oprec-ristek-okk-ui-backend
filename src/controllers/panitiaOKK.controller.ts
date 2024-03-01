// buat method sehingga panitia bisa bikin model rapatOKK beserta siapa aja yg ikut
import { Response } from "express";
import RapatOKK from "../interfaces/rapatOKK.interface";
import IsiAbsensiRapatRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/IsiAbsensiRapatRequestBody.interface";
import MakeRapatRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/makeRapatRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import MahasiswaModel from "../models/mahasiswa.model";
import MeetingModel from "../models/meeting.model";
import PanitiaOKKModel from "../models/panitiaOKK.model";
import RapatOKKModel from "../models/rapatOKK.model";
import UserModel from "../models/user.model";

const makeRapatSession = async (req: RequestWithPanitia, res: Response) => {
    const { lokasiRapat, kesimpulanRapat, passphraseAbsensi }: MakeRapatRequestBody = req.body as MakeRapatRequestBody
    try {
        if (! ["Penanggung Jawab", "Wakil Penanggung Jawab"].includes(req.panitia.jabatan)) return res.status(403).send("Hanya PJ dan WaPJ yang dapat membuat rapat!")
        if (! lokasiRapat || ! kesimpulanRapat) return res.status(404).send("lokasiRapat dan kesimpulanRapat harus diisi!")
        const mahasiswaFromIdPanitia = await MahasiswaModel.findById(req.panitia.mahasiswaId)
        if (! mahasiswaFromIdPanitia) return res.sendStatus(403)

        const listHadir = [mahasiswaFromIdPanitia._id]
        const meeting = new MeetingModel({ tempat: lokasiRapat, listHadir, passphraseAbsensi })
        await meeting.save()

        const rapatOKK = new RapatOKKModel({ meetingId: meeting._id, kesimpulanRapat, bidangTerkaitRapat: req.panitia.bidangTerkait })
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
        if (! ["Penanggung Jawab", "Wakil Penanggung Jawab"].includes(req.panitia.jabatan)) return res.status(403).send("Hanya PJ dan WaPJ yang dapat melihat rapat!")
        const allRapat = await RapatOKKModel.find({})
        const allRapatWithAdditionalInfo = await Promise.all(allRapat.map(async (rapat: RapatOKK) => {
            const meeting = await MeetingModel.findById(rapat.meetingId)
            return { rapat, meeting }
        }))
        res.json(allRapatWithAdditionalInfo)
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

        if (rapat.bidangTerkaitRapat !== req.panitia.bidangTerkait) {
            return res.status(403).send(`Rapat ini dikhususkan untuk panitia dengan bidang ${rapat.bidangTerkaitRapat}, anda tidak dapat mengisi absensi rapat ini.`)
        }
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

const deleteRapatById = async (req: RequestWithPanitia, res: Response) => {
    if (! ["Penanggung Jawab", "Wakil Penanggung Jawab"].includes(req.panitia.jabatan)) res.status(403).send("Hanya PJ dan WaPJ yang dapat menghapus rapat")
    try {
        const rapatId = req.params.rapatId
        const meetingId = (await RapatOKKModel.findById(rapatId))?.meetingId
        await RapatOKKModel.findOneAndDelete({ _id: rapatId })
        await MeetingModel.findOneAndDelete({ _id: meetingId })
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeRapatSession, getAllRapatSession, isiAbsensiRapat, deleteRapatById }