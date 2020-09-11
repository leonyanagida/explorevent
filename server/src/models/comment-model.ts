import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './user-model'
import { IEvent } from './event-model'

export interface IComment extends Document {
  commentLikes: IUser['_id']
  creatorId: IUser['_id']
  eventId: IEvent['_id']
  replyToId: IComment['_id']
  text: string
  published: boolean
}

const CommentSchema: Schema = new Schema(
  {
    commentLikes: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    replyToId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    text: { type: String, required: true },
    published: { type: Boolean, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IComment>('Comment', CommentSchema)
