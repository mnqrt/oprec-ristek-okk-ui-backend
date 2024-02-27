import { Router } from 'express'
import { getAllMentoringSession, isiAbsensiMentoring, makeMentoringSession } from '../controllers/kelompokOKK.controller'
import { authenticateMentor, authenticatePeserta, authenticateUser } from '../middlewares/auth.middleware'

const kelompokOKKRouter: Router = Router()

kelompokOKKRouter.use(authenticateUser)

kelompokOKKRouter.patch('/isi-absensi-mentoring', authenticatePeserta, isiAbsensiMentoring)
kelompokOKKRouter.get('/get-all-mentoring', authenticateMentor, getAllMentoringSession)
kelompokOKKRouter.post('/create-mentoring', authenticateMentor, makeMentoringSession)

export default kelompokOKKRouter