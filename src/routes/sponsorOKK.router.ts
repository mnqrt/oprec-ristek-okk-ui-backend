import { Router } from 'express'
import { makeProposalSponsor, responDariSponsor, getAllProposalSponsor, deleteProposalSponsorById } from '../controllers/sponsorOKK.controller'
import { authenticatePanitia, authenticateUser, authenticateSponsor } from '../middlewares/auth.middleware'

const sponsorOKKRouter: Router = Router()

sponsorOKKRouter.use(authenticateUser)

sponsorOKKRouter.get('/get-all-proposal-sponsor', authenticatePanitia, getAllProposalSponsor)
sponsorOKKRouter.post('/create-proposal-sponsor', authenticatePanitia, makeProposalSponsor)
sponsorOKKRouter.patch('/respon-proposal', authenticateSponsor, responDariSponsor)
sponsorOKKRouter.delete('/delete-proposal-sponsor-by-id/:proposalSponsorId', deleteProposalSponsorById)

export default sponsorOKKRouter