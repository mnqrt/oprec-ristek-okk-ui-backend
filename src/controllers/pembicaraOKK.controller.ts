/*
materiProposal: string, //materi diberikan oleh pembicara, sehingga awalnya bernilai null
statusProposal: "Diterima Panitia" | "Diterima Pembicara (Menunggu Konfirmasi Panitia)" | "Menunggu Konfirmasi Pembicara" | "Ditolak Panitia" | "Ditolak Pembicara",

Penjelasan:
1. Ketika panitia membuat proposal kepada pembicara, awalnya materiProposal = null (karena materi dari pembicara), status proposal = "Menunggu Konfirmasi Pembicara"
2. Pembicara yang mendapatkan proposal memiliki 2 pilihan:
    a. Pembicara menolak proposal, maka statusProposal = "Ditolak Pembicara". Selesai.
    b. Pembicara menerima proposal, maka statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)" dan pembicara menuliskan materiProposal
3. Ketika pembicara telah menerima proposal (2a), maka panitia akan membaca materi dan memiliki 2 pilihan:
    a. Panitia menolak materiProposal, maka statusProposal = "Ditolak Panitia". Sehingga Pembicara dapat mengusulkan materiProposal yang baru
    b. Panitia menerima materiProposal, maka statusProposal = "Diterima Panitia" dan pembicara beserta materi akan dimasukan kedalam listPembicaraBesertaMateri pada model acaraOKK. Selesai.
4. Ketika materi ditolak oleh pembicara (3a), maka pembicara memiliki 2 pilihan:
    a. Pembicara menolak proposal (bisa jadi karena ide yang ditawarkan ditolak, ataupun sudah tidak ada ide lain), maka statusProposal = "Ditolak Pembicara". Selesai.
    b. Pembicara mengirimkan materiProposal baru kepada panitia. Sehingga statusProposal = "Diterima Pembicara (Menunggu konfirmasi Panitia)"

ulang step 3-4 SELAMA statusProposal !== "Diterima Panitia" dan statusProposal !== "Ditolak Pembicara"
*/
import { Response } from "express";
import AccOrDeclinemateriPembicaraRequestBody from "../interfaces/RequestInterfaces/accOrDeclinemateriPembicaraRequestBody.interface";
import makeProposalPembicaraRequestBody from "../interfaces/RequestInterfaces/makeProposalPembicaraRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import RequestWithPembicara from "../interfaces/RequestInterfaces/requestWithPembicara.interface";
import ResponProposalPembicaraRequestBody from "../interfaces/RequestInterfaces/responProposalPembicaraRequestBody.interface";
import AcaraOKKModel from "../models/acaraOKK.model";
import PembicaraOKKModel from "../models/pembicaraOKK.model";
import ProposalPembicaraOKKModel from "../models/proposalPembicaraOKK.model";

const makeProposalPembicara = async (req: RequestWithPanitia, res: Response) => {
    const { pembicaraId, acaraId }: makeProposalPembicaraRequestBody = req.body as makeProposalPembicaraRequestBody
    try {
        if (! pembicaraId || ! acaraId) return res.status(400).send("pembicaraId dan acaraId tidak boleh kosong!")
        const proposalPembicara = new ProposalPembicaraOKKModel({ pembicaraId, acaraId, statusProposal: "Menunggu Konfirmasi Pembicara" })
        await proposalPembicara.save()
        res.json(proposalPembicara)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const responProposalPembicara = async (req: RequestWithPembicara, res: Response) => {
    const { proposalPembicaraId, statusProposal, materi }: ResponProposalPembicaraRequestBody = req.body as ResponProposalPembicaraRequestBody
    try {
        if (! proposalPembicaraId || ! statusProposal) return res.status(400).send("proposalPembicaraId dan statusProposal tidak boleh kosong!")
        if (statusProposal !== "Ditolak Pembicara" && ! materi) return res.status(400).send("Jika pembicara menerima proposal, materi tidak boleh kosong!")
        const proposalPembicara = await ProposalPembicaraOKKModel.findById(proposalPembicaraId)
        if (! proposalPembicara) return res.status(400).send(`Tidak ditemukan ProposalPembicara dengan id ${proposalPembicaraId}`)
        if (proposalPembicara.statusProposal !== "Menunggu Konfirmasi Pembicara") return res.status(400).send("Request tidak Sesuai dengan Status Proposal.")

        proposalPembicara.statusProposal = statusProposal
        proposalPembicara.materiProposal = materi
        await proposalPembicara.save()

        if (statusProposal === "Ditolak Pembicara") {
            return res.status(204).send("Penolakan Proposal telah tercatat.")
        }
        return res.status(202).send("Penerimaan Proposal telah tercatat, Panitia akan memeriksa materi dari Pembicara.")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const accOrDeclinemateriPembicara = async (req: RequestWithPanitia, res: Response) => {
    const { proposalPembicaraId, statusProposal }: AccOrDeclinemateriPembicaraRequestBody = req.body as AccOrDeclinemateriPembicaraRequestBody
    try {
        if (! proposalPembicaraId || ! statusProposal) return res.status(400).send("proposalPembicaraId dan statusProposal tidak boleh kosong!")
        const proposalPembicara = await ProposalPembicaraOKKModel.findById(proposalPembicaraId)
        if (! proposalPembicara) return res.status(400).send(`Tidak ditemukan ProposalPembicara dengan id ${proposalPembicaraId}`)
        if (proposalPembicara.statusProposal !== "Diterima Pembicara (Menunggu Konfirmasi Panitia)") return res.status(400).send("Request tidak Sesuai dengan Status Proposal.")
        
        proposalPembicara.statusProposal = statusProposal
        await proposalPembicara.save()

        if (statusProposal === "Diterima Panitia") {
            const acaraFromProposalId = await AcaraOKKModel.findById(proposalPembicara.acaraId)

            acaraFromProposalId?.listPembicaraBesertaMateri.push({ pembicaraAcara: proposalPembicara.pembicaraId, materi: proposalPembicara.materiProposal })
            await acaraFromProposalId?.save()

            const pembicara = await PembicaraOKKModel.findById(proposalPembicara.pembicaraId)
            pembicara?.listAcaraDiisi.push( proposalPembicara.acaraId )
            await pembicara?.save()

            return res.status(204).json({ proposalPembicara: proposalPembicara, acara: acaraFromProposalId })
        }
        res.status(204).json(proposalPembicara)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const respondToDeclinedMateri = async (req: RequestWithPembicara, res: Response) => {
    const { proposalPembicaraId, statusProposal, materi }: ResponProposalPembicaraRequestBody = req.body as ResponProposalPembicaraRequestBody
    try {
        if (! proposalPembicaraId || ! statusProposal) return res.status(400).send("proposalPembicaraId dan statusProposal tidak boleh kosong!")
        if (statusProposal !== "Ditolak Pembicara" && ! materi) return res.status(400).send("Jika pembicara menerima proposal, materi tidak boleh kosong!")
        const proposalPembicara = await ProposalPembicaraOKKModel.findById(proposalPembicaraId)
        if (! proposalPembicara) return res.status(400).send(`Tidak ditemukan ProposalPembicara dengan id ${proposalPembicaraId}`)
        if (proposalPembicara.statusProposal !== "Ditolak Panitia") return res.status(400).send("Request tidak Sesuai dengan Status Proposal.")

        proposalPembicara.statusProposal = statusProposal
        proposalPembicara.materiProposal = materi
        await proposalPembicara.save()

        if (statusProposal === "Ditolak Pembicara") {
            return res.status(204).send("Penolakan Proposal telah tercatat.")
        }
        return res.status(202).send("Penerimaan Proposal telah tercatat, Panitia akan memeriksa materi dari Pembicara.")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllProposalPembicara = async (req: RequestWithPanitia, res: Response) => {
    try {
        res.json(await ProposalPembicaraOKKModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeProposalPembicara, responProposalPembicara, accOrDeclinemateriPembicara, respondToDeclinedMateri, getAllProposalPembicara }