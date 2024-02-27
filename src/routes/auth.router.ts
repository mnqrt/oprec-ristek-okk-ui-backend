import { Router } from 'express'
import { register, login, deleteAll, deleteAllToken, getAllMentor, getAllPeserta, getAllPanitia, deleteAllMeeting } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.get('/get-all-peserta', getAllPeserta)
authRouter.get('/get-all-mentor', getAllMentor)
authRouter.get('/get-all-panitia', getAllPanitia)

authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.delete('/delete-all', deleteAll)
authRouter.delete('/delete-all-token', deleteAllToken)
authRouter.delete('/delete-all-meeting', deleteAllMeeting)

export default authRouter