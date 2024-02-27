import { Router } from 'express'
import { getAllRapatSession, makeRapatSession } from '../controllers/panitiaOKK.controller'
import { authenticatePanitia, authenticateUser } from '../middlewares/auth.middleware'

const panitiaOKKRouter: Router = Router()

panitiaOKKRouter.use(authenticateUser)
panitiaOKKRouter.use(authenticatePanitia)

panitiaOKKRouter.get('/get-all-rapat', getAllRapatSession)
panitiaOKKRouter.post('/create-rapat', makeRapatSession)

export default panitiaOKKRouter