import MakeAcaraRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/makeAcaraRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import AcaraOKKModel from "../models/acaraOKK.model";
import { Response } from "express";


const makeAcara = async (req: RequestWithPanitia, res: Response) => {
    const { namaAcara, jadwalAcara }: MakeAcaraRequestBody = req.body as MakeAcaraRequestBody
    try {
        const acara = new AcaraOKKModel({ namaAcara, jadwalAcara: new Date(jadwalAcara), listPembicaraBesertaMateri: [], listSponsorBesertaPaket: [] })
        await acara.save()
        res.json(acara)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllAcara = async (req: RequestWithPanitia, res: Response) => {
    try {
        res.json(await AcaraOKKModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeAcara, getAllAcara }