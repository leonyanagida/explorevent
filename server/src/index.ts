import { Request, Response } from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import errorhandler from 'errorhandler'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import path from 'path'
import session from 'express-session'
import { apiRouter } from './routes'
import { errorHandler } from './middleware/error-middleware'
import { notFoundHandler } from './middleware/notfound-middleware'
import './config/passport' // Passport configuration

dotenv.config()

const MemoryStore = require('memorystore')(session)
const app: Application = express()
const apiRoot = 'api'
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../../client/build')))
app.use(helmet()) // Use as early as possible in application
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Body-parser is built into express
app.use(compression())
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24 hours
    }),
    secret: process.env.SECRET!,
  })
)
// Initialize passport
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
if (process.env.NODE_ENV !== 'production') {
  app.use(errorhandler())
}
if (process.env.NODE_ENV === 'production') {
  mongoose
    .connect(process.env.ATLAS_URI!, {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err: Error) => console.log('err' + err))
} else {
  // Note only uncomment one at a time
  // ========================================= //
  // SCRIPT: yarn run test  <================= //
  // For testing with jest
  // mongoose.connect(global.__MONGO_URI__!, {
  //   useFindAndModify: false,
  //   useCreateIndex: true,
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  //========================================== //
  //
  //========================================== //
  // SCRIPT: yarn run dev <=================== //
  // For testing in local environment
  mongoose.connect(process.env.ATLAS_URI!, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
//========================================== //
app.use(`/${apiRoot}`, apiRouter)
app.use(errorHandler)
app.use(notFoundHandler)
// All remaining requests return the React app, so it can handle routing.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
})

export default app
