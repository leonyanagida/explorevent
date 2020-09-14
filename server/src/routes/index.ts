import express from 'express'
import { authRouter } from './auth'
import { commentRouter } from './comment'
import { eventRouter } from './event'
import { userRouter } from './user'

export const apiRouter = express.Router()
// Note: The flow of data through the application
// ==================================================
// Routes + Middleware (Also includes 3rd party APIs) =>  <= Controller =>  <= Models
// ==================================================
// Routes + Middleware may only talk to the controller
// Controller communicates between the routes and models (the glue that puts things together)
// Models may only talk to the controller
apiRouter.use('/auth', authRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/events', eventRouter)
apiRouter.use('/users', userRouter)
