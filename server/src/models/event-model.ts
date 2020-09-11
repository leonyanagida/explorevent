import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './user-model'
import { IComment } from './comment-model'

export interface IEvent extends Document {
  eventAddress: string
  eventCity: string
  eventState: string
  eventZip: string
  eventStartDate: string
  eventEndDate: string
  eventStartTime: string
  eventEndTime: string
  online: boolean
  creatorId: IUser['_id']
  eventComments: IComment['_id']
  eventDate: object[]
  eventHours: object[] 
  eventImg: string
  eventLikes: IUser['_id']
  eventName: string
  exclusive: boolean
  published: boolean
  text: string
  usersAttending: IUser['_id']
}

const EventSchema: Schema = new Schema(
  {
    eventAddress: { type: String },
    eventCity: { type: String },
    eventState: { type: String },
    eventZip: { type: String },
    eventStartDate: { type: String },
    eventEndDate: { type: String },
    eventStartTime: { type: String },
    eventEndTime: { type: String },
    online: { type: Boolean },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    eventDate: [{ type: Object }],
    eventHours: [{ type: Object }],
    eventImg: { type: String },
    eventLikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    eventName: { type: String },
    exclusive: { type: Boolean },
    published: { type: Boolean },
    text: { type: String },
    usersAttending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export default mongoose.model<IEvent>('Event', EventSchema)
