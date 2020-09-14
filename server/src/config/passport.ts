import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import passportLocal from 'passport-local'
import User from '../models/user-model'

const LocalStrategy = passportLocal.Strategy

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user._id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Sign in using Email and Password
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email: string, password: string, done: any) => {
      User.findOne({ email: email }, (err, user: any) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(undefined, false, { message: `Email ${email} not found.` })
        }
        // Compare password function created in the user model
        user.comparePassword(password, user.password, (err: Error, isMatch: boolean) => {
          if (err) {
            return done(err)
          }
          if (isMatch) {
            return done(undefined, user)
          }
          return done(undefined, false, { message: 'Invalid email or password.' })
        })
      }).catch((err) => done(err))
    }
  )
)

export const loggedInOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) next()
  else res.status(401).send({ message: 'Is not authenticated' })
}

export const loggedOutOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.isUnauthenticated()) next()
  else res.status(401).send({ message: 'Is not authenticated' })
}
