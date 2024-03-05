import { Router } from 'express'
import { register, login, logout, deleteAllToken, getAllMentor, getAllPeserta, getAllPanitia, deleteAllMeeting, getAllSponsor, getAllPembicara, deleteAll, changePassword } from '../controllers/auth.controller'
import { authenticatePanitia, authenticateUser } from '../middlewares/auth.middleware'

const authRouter: Router = Router()

authRouter.get('/get-all-peserta', getAllPeserta)
authRouter.get('/get-all-mentor', getAllMentor)
authRouter.get('/get-all-panitia', getAllPanitia)
authRouter.get('/get-all-sponsor', getAllSponsor)
authRouter.get('/get-all-pembicara', getAllPembicara)

authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.patch('/change-password', authenticateUser, changePassword)

authRouter.delete('/logout', logout)
authRouter.delete('/delete-all-token', deleteAllToken)
authRouter.delete('/delete-all-meeting', deleteAllMeeting)
authRouter.delete('/delete-all', deleteAll)

export default authRouter