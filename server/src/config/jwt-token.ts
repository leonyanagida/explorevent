import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const generateToken = ({
  next,
  res,
  email,
  id,
  username,
}: {
  next: NextFunction
  res: Response
  email: string
  id: string
  username: string
}) => {
  const token = jwt.sign({ email, id, username }, 'secret', {
    expiresIn: '30d',
  })
  // Create a token that will be used for the front-end
  return res.cookie('token', token, {
    expires: new Date(Date.now() + 2592000000), // 30 days
    secure: false, // set to true if your using https
    httpOnly: true,
  })
}

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  // Only the backend has access to https cookies
  const token = req.cookies.token || ''
  try {
    if (!token) {
      return res.send({})
    }
    // Decrypt the token
    const decrypt: any = await jwt.verify(token, 'secret')
    req.user = {
      email: decrypt.email,
      id: decrypt.id,
      username: decrypt.username,
    }
    next()
  } catch (err) {
    return res.status(500).json(err.toString())
  }
}

export const clearToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || ''
  try {
    if (!token) {
      // Means that the token has already expired
      res.clearCookie('token', { path: '/' })
      return next()
    }
    // Decrypt the token
    const decrypt = await jwt.verify(token, 'secret')
    if (decrypt) {
      res.clearCookie('token', { path: '/' })
      return next()
    }
  } catch (err) {
    return res.status(500).json(err.toString())
  }
}
