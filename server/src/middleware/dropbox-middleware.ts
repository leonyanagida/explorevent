import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'
import { cryptoEncrypt } from '../utils/node-crypto'

dotenv.config()

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch,
})

export const uploadMiddleware = (request: Request, response: Response, next: NextFunction) => {
  // We want to do some encryption to make it harder for users to randomly find other users images
  const encryptFilename = cryptoEncrypt(request.file.originalname)
  // Now we will upload the image to the dropbox
  return new Promise((resolve, reject) => {
    // This uploads basic.js to the root of your dropbox
    return dbx
      .filesUpload({
        path: '/' + encryptFilename + Date.now() + request.file.originalname,
        contents: request.file.buffer,
      })
      .then(function (img) {
        response.locals.imgName = img.name
        resolve(null)
        next()
      })
      .catch(function (err: DropboxTypes.Error<DropboxTypes.files.UploadError>) {
        reject()
        next(err)
      })
  })
}

export const deleteMiddleware = (request: Request, response: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    return dbx
      .filesDeleteV2({
        path: `/${request.body.eventImg}`,
      })
      .then(() => {
        resolve(null)
        next()
      })
      .catch((err: DropboxTypes.Error<DropboxTypes.files.UploadError>) => {
        reject()
        next(err)
      })
  })
}
