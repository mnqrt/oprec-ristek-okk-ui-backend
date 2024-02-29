import { Router } from 'express'
import { getAllMentoringSession, getMentoringSessionByMentor, isiAbsensiMentoring, makeMentoringSession } from '../controllers/kelompokOKK.controller'
import { authenticateMentor, authenticatePanitia, authenticatePeserta, authenticateUser } from '../middlewares/auth.middleware'

const kelompokOKKRouter: Router = Router()

kelompokOKKRouter.use(authenticateUser)

kelompokOKKRouter.get('/get-all-mentoring', authenticatePanitia, getAllMentoringSession)
kelompokOKKRouter.get('/get-all-mentoring-by-mentor', authenticateMentor, getMentoringSessionByMentor)

kelompokOKKRouter.post('/create-mentoring', authenticateMentor, makeMentoringSession)

kelompokOKKRouter.patch('/isi-absensi-mentoring', authenticatePeserta, isiAbsensiMentoring)

export default kelompokOKKRouter