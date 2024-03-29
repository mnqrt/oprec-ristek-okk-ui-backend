import { Router } from "express";
import { deleteAcaraById, getAllAcara, makeAcara } from "../controllers/acaraOKK.controller";
import { authenticatePanitia, authenticateUser } from "../middlewares/auth.middleware";

const acaraRouter: Router = Router()

acaraRouter.use(authenticateUser, authenticatePanitia)

acaraRouter.post('/create-acara', makeAcara)
acaraRouter.get('/get-all-acara', getAllAcara)
acaraRouter.delete('/delete-acara-by-id/:acaraId', deleteAcaraById)

export default acaraRouter