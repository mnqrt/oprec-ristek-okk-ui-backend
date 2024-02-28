import { Router } from 'express'
import { register, login, deleteAll, deleteAllToken, getAllMentor, getAllPeserta, getAllPanitia, deleteAllMeeting, getAllSponsor, getAllPembicara, deleteAllSponsor_Pembicara_Acara_Proposal } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.get('/get-all-peserta', getAllPeserta)
authRouter.get('/get-all-mentor', getAllMentor)
authRouter.get('/get-all-panitia', getAllPanitia)
authRouter.get('/get-all-sponsor', getAllSponsor)
authRouter.get('/get-all-pembicara', getAllPembicara)

authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.delete('/delete-all', deleteAll)
authRouter.delete('/delete-all-token', deleteAllToken)
authRouter.delete('/delete-all-meeting', deleteAllMeeting)
authRouter.delete('/delete-all-sponsor-pembicara-acara-proposal', deleteAllSponsor_Pembicara_Acara_Proposal)

export default authRouter