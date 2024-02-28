import { Response } from "express";
import makeProposalSponsorRequestBody from "../interfaces/RequestInterfaces/makeProposalSponsorRequestBody.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import RequestWithSponsor from "../interfaces/RequestInterfaces/requestWithSponsor.interface";
import ResponDariSponsorRequestBody from "../interfaces/RequestInterfaces/responDariSponsorRequestBody.interface";
import AcaraOKKModel from "../models/acaraOKK.model";
import ProposalSponsorOKKModel from "../models/proposalSponsorOKK.model";

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

        proposalSponsorOKK.statusProposal = statusProposal
        proposalSponsorOKK.paket = paket
        await proposalSponsorOKK.save()

        if (statusProposal !== "Ditolak") {
            const acaraFromProposalId = await AcaraOKKModel.findById(proposalSponsorOKK.acaraId)
            acaraFromProposalId?.listSponsorBesertaPaket.push({})
            await acaraFromProposalId?.save()
        }

        res.status(200).json({ proposal: proposalSponsorOKK, acaraOKK: await AcaraOKKModel.findById(proposalSponsorOKK.acaraId)})
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

export { makeProposalSponsor, responDariSponsor, getAllProposalSponsor }