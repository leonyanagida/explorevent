import express, { Request, Response, NextFunction } from 'express'
import { checkToken, clearToken } from '../config/jwt-token'

export const authRouter = express.Router()

authRouter.get(`/checktoken`, checkToken, (request: Request, response: Response, next: NextFunction) => {
  // If we made it this far, we must have found a token for the user
  return response.status(200).send(request.user)
})

authRouter.get(`/cleartoken`, clearToken, (request: Request, response: Response, next: NextFunction) => {
  return response.status(200).send()
})
