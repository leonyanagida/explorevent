import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import * as passportConfig from '../config/passport'
import { isEmptyObj } from '../utils/is-empty'
import { clearToken, generateToken } from '../config/jwt-token'
// Import controllers
import UserController from '../controllers/user-controller'
import EventController from '../controllers/event-controller'
import CommentController from '../controllers/comment-controller'

export const userRouter = express.Router()

userRouter.post(
  '/edit/details',
  passportConfig.loggedInOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // We have to make sure that only the creator can edit the comment
      if (req.body.userId !== req.session?.passport.user) {
        return res.status(401).send() // Send unauthorized
      }
      const user = await UserController.EditUserDetails({
        about: req.body.about,
        fullName: req.body.fullName,
        username: req.body.username,
        userId: req.body.userId,
      })
      return res.status(200).send({ user })
    } catch (err) {
      return res.status(400).send({ error: err, message: 'Unable to edit user' })
    }
  }
)

userRouter.post('/edit/email', passportConfig.loggedInOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We have to make sure that only the creator can edit the comment
    if (req.body.userId !== req.session?.passport.user) {
      return res.status(401).send() // Send unauthorized
    }
    const user = await UserController.EditUserEmail({
      email: req.body.email,
      userId: req.body.userId,
    })
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to edit user' })
  }
})

userRouter.post(
  '/edit/password',
  passportConfig.loggedInOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // We have to make sure that only the creator can edit the comment
      if (req.body.userId !== req.session?.passport.user) {
        return res.status(401).send() // Send unauthorized
      }
      await UserController.EditUserPassword({
        password: req.body.password,
        userId: req.body.userId,
      })
      return res.status(200).send()
    } catch (err) {
      return res.status(400).send({ error: err, message: 'Unable to edit user' })
    }
  }
)

// To delete a user
userRouter.post('/delete', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    // Delete the user
    await UserController.DeleteUserById(req.body.userId)
    // Delete any events the user has created
    // - If there are any comments, changed the event name to [Event has been deleted], but keep the event
    await EventController.DeleteAllUserEventsById(req.body.userId)
    // Make sure to remove the user's comments
    // - If there are any replies to the user's comments, change the text to [deleted]
    await CommentController.DeletedAccountEditCommentById(req.body.userId)
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to delete user' })
  }
})

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      // Make sure to generate a https cookie
      generateToken({ next: next, res: res, email: user.email, id: user._id, username: user.username })
      return res.status(200).send({ email: user.email, id: user._id, username: user.username })
    })
  })(req, res, next)
})

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.CreateNewUser({
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password,
      username: req.body.username,
    })

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        // Make sure to generate a https cookie
        generateToken({ next: next, res: res, email: user.email, id: user._id, username: user.username })
        return res.status(200).send({ email: user.email, id: user._id, username: user.username })
      })
    })(req, res, next)

    // return res.status(200).send({ email: user.email, id: user._id, username: user.username })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to sign up user' })
  }
})

userRouter.get('/profile/public/:userId', async (req: Request, res: Response) => {
  try {
    const user = await UserController.FindUserProfileById(req.params.userId)
    return res.status(200).send({
      about: user?.about,
      createdEvents: user?.createdEvents,
      fullName: user?.fullName,
      id: user?._id,
      username: user?.username,
    })
  } catch (err) {
    return res.status(404).send({ error: err, message: 'Unable to find user' })
  }
})

userRouter.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const user = await UserController.FindUserProfileById(req.params.userId)
    return res.status(200).send({ about: user?.about, fullName: user?.fullName, id: user?._id, username: user?.username })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to find user' })
  }
})

userRouter.get('/username/:username', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    const user = await UserController.FindUserByUsername(req.params.username)
    return res.status(200).send({ user })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to find user with that username' })
  }
})

userRouter.get('/email/:email', async (req: Request, res: Response) => {
  try {
    // Get event by id
    const user = await UserController.FindUserByEmail(req.params.email)
    return res.status(200).send({ email: user?.email })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to get email' })
  }
})

userRouter.get('/checkauth', async (req: Request, res: Response) => {
  const userSession = req.session?.passport
  // Check passport session for the user
  if (isEmptyObj(userSession)) {
    // For errors, make sure to send an empty object to the front-end
    // On the front-end we are checking the object to see if the object contains an user id
    return res.send({})
  }
  // Only return the user session if the userSession is not empty
  return res.status(200).send(userSession)
})

userRouter.get('/logout', clearToken, async (req: Request, res: Response, next: NextFunction) => {
  req.logout()
  return res.status(200).send({ message: 'Logged out' })
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await UserController.FindUserById(req.params.userId)
    return res.status(200).send({ user })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to find user' })
  }
})

userRouter.get('/', async (req: Request, res: Response) => {
  try {
    //Get all users
    const user = await UserController.FindUserAll()
    return res.status(200).send({ user })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Error getting all users' })
  }
})
