import { Router } from "express";
import { authenticatePanitia, authenticatePembicara, authenticateUser } from "../middlewares/auth.middleware";
import { makeProposalPembicara, responProposalPembicara, accOrDeclinemateriPembicara, respondToDeclinedMateri, getAllProposalPembicara, deleteProposalPembicaraById } from "../controllers/pembicaraOKK.controller";

const pembicaraOKKRouter: Router = Router()

pembicaraOKKRouter.use(authenticateUser)

pembicaraOKKRouter.get('/get-all-proposal-pembicara', authenticatePanitia, getAllProposalPembicara)
pembicaraOKKRouter.post('/create-proposal-pembicara', authenticatePanitia, makeProposalPembicara)
pembicaraOKKRouter.patch('/respon-proposal-pembicara', authenticatePembicara, responProposalPembicara)
pembicaraOKKRouter.patch('/accept-or-decline-materi', authenticatePanitia, accOrDeclinemateriPembicara)
pembicaraOKKRouter.patch('/respond-to-declined-materi', authenticatePembicara, respondToDeclinedMateri)
pembicaraOKKRouter.delete('/delete-proposal-pembicara-by-id/:proposalPembicaraId', deleteProposalPembicaraById)

export default pembicaraOKKRouter
