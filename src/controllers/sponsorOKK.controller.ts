import { Response } from "express";
import makeProposalSponsorRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/makeProposalSponsorRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import RequestWithSponsor from "../interfaces/RequestInterfaces/requestWithSponsor.interface";
import ResponDariSponsorRequestBody from "../interfaces/RequestInterfaces/RequestBodyInterface/responDariSponsorRequestBody.interface";
import AcaraOKKModel from "../models/acaraOKK.model";
import ProposalSponsorOKKModel from "../models/proposalSponsorOKK.model";
import SponsorOKKModel from "../models/sponsorOKK.model";

const makeProposalSponsor = async (req: RequestWithPanitia, res: Response) => {
    const { acaraId, sponsorId }: makeProposalSponsorRequestBody = req.body as makeProposalSponsorRequestBody
    try {
        if (! acaraId || ! sponsorId) return res.status(400).send("acaraId dan sponsorId tidak boleh null!")
        const proposalSponsorOKK = new ProposalSponsorOKKModel({ acaraId, sponsorId, statusProposal: "Menunggu Konfirmasi Sponsor" })
        await proposalSponsorOKK.save()
        res.json(proposalSponsorOKK)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const responDariSponsor = async (req: RequestWithSponsor, res: Response) => {
    const { proposalSponsorId, statusProposal, paket }: ResponDariSponsorRequestBody = req.body as ResponDariSponsorRequestBody
    try {
        if (! proposalSponsorId || ! statusProposal) return res.status(400).send("proposalSponsorId dan statusProposal tidak boleh null!")
        if (statusProposal !== "Ditolak" && ! paket) return res.status(400).send("jika menerima proposal, paket tidak boleh null!")
        const proposalSponsorOKK = await ProposalSponsorOKKModel.findById(proposalSponsorId)
        if (! proposalSponsorOKK) return res.status(400).send(`Tidak ada proposal sponsor dengan if ${proposalSponsorId}`)
        if (proposalSponsorOKK.statusProposal !== "Menunggu Konfirmasi Sponsor") return res.status(400).send("Request tidak sesuai dengan status Proposal.")

        proposalSponsorOKK.statusProposal = statusProposal
        proposalSponsorOKK.paket = paket
        await proposalSponsorOKK.save()

        if (statusProposal !== "Ditolak") {
            const acaraFromProposalId = await AcaraOKKModel.findById(proposalSponsorOKK.acaraId)
            acaraFromProposalId?.listSponsorBesertaPaket.push({ sponsor: proposalSponsorOKK.sponsorId, paket })
            await acaraFromProposalId?.save()

            const sponsor = await SponsorOKKModel.findById(proposalSponsorOKK.sponsorId)
            sponsor?.listAcaraDisponsori.push(proposalSponsorOKK.acaraId)
            await sponsor?.save()

            res.status(204).json({ proposal: proposalSponsorOKK, acaraOKK: await AcaraOKKModel.findById(proposalSponsorOKK.acaraId), acara: acaraFromProposalId})
        }

        res.status(204).json({ proposal: proposalSponsorOKK})
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllProposalSponsor = async (req: RequestWithPanitia, res: Response) => {
    try {
        res.json(await ProposalSponsorOKKModel.find({}))
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteProposalSponsorById = async (req: RequestWithPanitia, res: Response) => {
    try {
        const proposalSponsorId = req.params.proposalSponsorId
        if (! proposalSponsorId) return res.status(404).send("proposalSponsorId tidak ditemukan")
        await ProposalSponsorOKKModel.findByIdAndDelete(proposalSponsorId)
        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { makeProposalSponsor, responDariSponsor, getAllProposalSponsor, deleteProposalSponsorById }