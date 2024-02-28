import { Router } from 'express'
import { makeProposalSponsor, responDariSponsor, getAllProposalSponsor } from '../controllers/sponsorOKK.controller'
import { authenticatePanitia, authenticateUser, authenticateSponsor } from '../middlewares/auth.middleware'

const sponsorOKKRouter: Router = Router()

sponsorOKKRouter.use(authenticateUser)

sponsorOKKRouter.get('/get-all-proposal-sponsor', authenticatePanitia, getAllProposalSponsor)
sponsorOKKRouter.post('/make-proposal-sponsor', authenticatePanitia, makeProposalSponsor)
sponsorOKKRouter.patch('/respon-proposal', authenticateSponsor, responDariSponsor)

export default sponsorOKKRouter