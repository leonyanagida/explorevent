import express, { Application, Response, Request } from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import errorhandler from 'errorhandler'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import path from 'path'
import session from 'express-session'
import { apiRouter } from './routes'
import './config/passport' // Passport configuration

dotenv.config()

let RedisStore = require('connect-redis')(session)
const app: Application = express()
const apiRoot = 'api'
let redisClient
// Documentation to implement Redis found on heroku website
if (process.env.NODE_ENV === 'production') {
  redisClient = require('redis').createClient({
    port: process.env.REDIS_PORT, // replace with your port
    host: process.env.REDIS_HOST, // replace with your hostanme or IP address
    password: process.env.REDIS_PASS, // replace with your password
  })
} else {
  redisClient = require('redis').createClient()
  // Redis error handling
  redisClient.on('error', (err: Error) => {
    console.log('Redis error: ', err) // For logging
  })
  redisClient.on('connect', () => {
    console.log(`connected to redis`) // For logging
  })
}
// Priority serve any static files.
app.use(express.static(path.join(__dirname, '../../client/build')))
app.use(helmet()) // Use as early as possible in application
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Body-parser is built into express
app.use(compression())
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    cookie: { maxAge: 86400000 }, // 24 hours
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET!,
    store: new RedisStore({ client: redisClient }),
  })
)
// Initialize passport
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
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
// Moved the app get client to the bottom of the express app
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client', 'build/index.html'))
})
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client', 'build/index.html'))
})

export default app
