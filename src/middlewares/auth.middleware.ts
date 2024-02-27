import { NextFunction, Request, Response } from "express";
import { generateToken } from "../controllers/auth.controller";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import User from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import RequestWithUser from "../interfaces/RequestInterfaces/requestWithUser.interface";
import RequestWithPanitia from "../interfaces/RequestInterfaces/requestWithPanitia.interface";
import PanitiaOKKModel from "../models/panitiaOKK.model";
import RequestWithPeserta from "../interfaces/RequestInterfaces/requestWithPeserta.interface";
import PesertaOKKModel from "../models/pesertaOKK.model";
import RequestWithMentor from "../interfaces/RequestInterfaces/requestWithMentor.model";
import MentorOKKModel from "../models/mentorOKK.model";
import RequestWithMahasiswa from "../interfaces/RequestInterfaces/requestWithMahasiswa.interface";
dotenv.config();

interface Id {
    id: string,
    iat: any,
    exp: any
}

async function authenticateUser (req: RequestWithUser, res: Response, next: NextFunction){
    const authHeaders = req.headers['authorization']
    var accessToken = authHeaders?.split(' ')[1]
    if (accessToken === undefined) {
        return res.sendStatus(401)
    }
    
    try {
        var idObject = jwt.verify(accessToken, (process.env as any).ACCESS_TOKEN_SECRET) as Id
        var user: User | null = await UserModel.findById(idObject.id)
        if (! user) {

            generateToken(req, res)
            accessToken = req.cookies['ACCESS_TOKEN_USER'] as string
            idObject = jwt.verify(accessToken, (process.env as any).ACCESS_TOKEN_SECRET) as Id
            user = await UserModel.findById(idObject.id)

            if (user) {
                req.user = user
                next()
                return
            }

            res.sendStatus(403)
            return
        }
        req.user = user
        next()
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

async function authenticatePanitia (req: RequestWithPanitia, res: Response, next: NextFunction) {
    const curUser: User = req.user
    if (curUser.role === "Panitia") {
        const panitiaFromUser = await PanitiaOKKModel.findOne({ userId: curUser._id })
        if (! panitiaFromUser) {
            return res.sendStatus(404)
        }
        req.panitia = panitiaFromUser
        next()
        return
    }
    return res.sendStatus(403)
}

async function authenticatePeserta (req: RequestWithPeserta, res: Response, next: NextFunction) {
    const curUser: User = req.user
    if (curUser.role === "Peserta") {
        const pesertaFromUser = await PesertaOKKModel.findOne({ userId: curUser._id })
        if (! pesertaFromUser) {
            return res.sendStatus(404)
        }
        req.peserta = pesertaFromUser
        next()
        return
    }
    return res.sendStatus(403)
}

async function authenticateMentor (req: RequestWithMentor, res: Response, next: NextFunction) {
    const curUser: User = req.user
    if (curUser.role === "Mentor") {
        const mentorFromUser = await MentorOKKModel.findOne({ userId: curUser._id })
        if (! mentorFromUser) {
            return res.sendStatus(404)
        }
        req.mentor = mentorFromUser
        next()
        return
    }
    return res.sendStatus(403)
}

export { authenticateUser, authenticateMentor, authenticatePanitia, authenticatePeserta }