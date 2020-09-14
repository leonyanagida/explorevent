import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { IEvent } from './event-model'
import { IComment } from './comment-model'

export interface IUser extends Document {
  about: string
  admin: boolean
  attendedEvents: IEvent['_id']
  attendingEvents: IEvent['_id']
  banned: boolean
  likedComments: IComment['_id']
  likedEvents: IEvent['_id']
  createdEvents: IEvent['_id']
  email: string
  fullName: string
  password: string
  username: string
  userComments: IComment['_id']
  comparePassword: comparePasswordFunction
}

type comparePasswordFunction = (candidatePassword: string, password: string, cb: (err: any, isMatch: any) => {}) => void

const UserSchema: Schema = new Schema(
  {
    about: { type: String },
    admin: { type: Boolean },
    attendedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    attendingEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    banned: { type: Boolean },
    likedComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    createdEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v: any) {
          return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v)
        },
        message: 'Password should contain letters and numbers and be at least 6 characters long',
      },
    },
    username: { type: String, required: true, unique: true },
    userComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
)

// Password hash middleware when creating an account
UserSchema.pre('save', function save(next) {
  const user = this as IUser
  if (!user.isModified('password')) {
    return next()
  }
  const saltRounds = 10
  bcrypt
    .hash(user.password, saltRounds)
    .then((hash) => {
      // Store hash in your password DB.
      user.password = hash
      next()
    })
    .catch((err) => next(err.message))
})

// NOTE: Password hash middleware is only for when updating the user's password
UserSchema.pre('findOneAndUpdate', async function save(next) {
  // Assign "this" to user
  const user: any = this
  try {
    // Make sure to only run this if we are updating the password
    if (user._update.password) {
      const saltRounds = 10
      const hashed = await bcrypt.hash(user._update.password, saltRounds)
      user._update.password = hashed
    }
    next()
  } catch (err) {
    return next(err)
  }
})

const comparePassword: comparePasswordFunction = function (candidatePassword, password, cb) {
  bcrypt.compare(candidatePassword, password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch)
  })
}

UserSchema.methods.comparePassword = comparePassword
// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema)
