import { Router } from 'express'
import { getAllRapatSession, isiAbsensiRapat, makeRapatSession } from '../controllers/panitiaOKK.controller'
import { authenticatePanitia, authenticateUser } from '../middlewares/auth.middleware'

const panitiaOKKRouter: Router = Router()

panitiaOKKRouter.use(authenticateUser)
panitiaOKKRouter.use(authenticatePanitia)

panitiaOKKRouter.patch('/isi-absensi-rapat', isiAbsensiRapat)
panitiaOKKRouter.get('/get-all-rapat', getAllRapatSession)
panitiaOKKRouter.post('/create-rapat', makeRapatSession)

export default panitiaOKKRouter