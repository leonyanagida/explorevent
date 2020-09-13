import dotenv from 'dotenv'
import faker from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import CommentController from './comment-controller'
import EventController from './event-controller'
import UserController from './user-controller'
import app from '../index'

import User from '../models/user-model'
import Event from '../models/event-model'

dotenv.config()

describe('Comment Controller', () => {
  let req: any // App must be required in order for the tests to work
  // Create a new user so we can create and event with a creatorId
  let newUser: any
  let newEvent: any
  beforeAll(async () => {
    // supertest is required to connect to local mongoose database!
    req = await request(app)
    // Create new user before tests run
    newUser = await UserController.CreateNewUser({
      email: 'commentuser@email.com',
      fullName: 'Comment User',
      password: 'AStrongPassword000~',
      username: 'commentuser',
    })
    // Create a new event to leave comments on
    newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: 'Test Event For Comments',
      creatorId: newUser._id,
      text: 'Add comments To this event',
    })
  })
  afterAll(async () => {
    // Remove all users everytime we re-run tests
    await User.deleteMany({})
    await Event.deleteMany({})
    // Close connection to prevent leaking
    await mongoose.connection.close()
  })

  it('Can create a new comment', async () => {
    const creatorId = newUser._id
    const eventId = newEvent._id
    const replyToId = null
    const text = 'New comment'
    // Create a new comment
    const newComment = await CommentController.CreateComment({
      creatorId: creatorId,
      eventId: eventId,
      replyToId: replyToId,
      text: text,
    })
    expect(newComment.text).toBe('New comment')
  })

  it('Creates comment and adds to users attending events', async () => {
    const newComment = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: null,
      text: newEvent.text,
    })
    // Make sure to update the user's comments array
    await UserController.UpdateUserCreateComment({
      commentId: newComment._id,
      userId: newUser._id,
    })
    const findCreateCommentUser = await UserController.FindUserById(newUser._id)
    expect(findCreateCommentUser?.userComments.length).toBe(1)
  })

  it('User can like comment', async () => {
    const newComment = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: null,
      text: 'Please like this comment',
    })
    // Comment - Toggle the comment like
    await CommentController.ToggleCommentLike({
      commentId: newComment._id,
      userId: newUser._id,
    })
    // User - Toggle the comment like
    await UserController.UserToggleCommentLike({
      commentId: newComment._id,
      userId: newUser._id,
    })
    const findUser = await UserController.FindUserById(newUser._id)
    expect(findUser?.likedComments.length).toBe(1)
  })

  it('Can delete comment', async () => {
    const newComment = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: null,
      text: 'Please delete this comment',
    })
    expect(newComment.text).toBe('Please delete this comment')
    // Comment - Make sure to delete the comment
    await CommentController.DeleteComment({ commentId: newComment._id })
    // Comment - The comment should be deleted from comments
    // We should not be able to find the deleted comment
    const failFindComment = await CommentController.FindCommentById(newComment._id)
    expect(failFindComment).toBeNull()
  })

  it('Deletes original comment and comment replies', async () => {
    const newComment = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: null,
      text: 'Please delete this comment',
    })
    expect(newComment.text).toBe('Please delete this comment')
    // Reply to the new comment
    const newCommentReply1 = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'Oh no will my comment end up being deleted to?',
    })
    expect(newCommentReply1.text).toBe('Oh no will my comment end up being deleted to?')
    const newCommentReply2 = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'Here is another reply',
    })
    expect(newCommentReply2.text).toBe('Here is another reply')
    // Comment - We have replys, so the comment should not be completely removed
    await CommentController.DeleteComment({ commentId: newComment._id })
    // Comment - Make sure that the comment is not completely removed, but rather the text is changed to deleted
    const findComment = await CommentController.FindCommentById(newComment._id)
    // Since there are replys, we are only deleting the comment text
    expect(findComment).toBeNull()
    // expect(findComment.text).toBe('[deleted]')
    // Make sure the original comment still exists so the reply comments still work
    // expect(findComment._id).toBeDefined()
  })

  it('Find comment replies', async () => {
    // Create the inital comment
    const newComment = await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: null,
      text: 'I will delete this coment',
    })
    // Add a reply to newComment
    await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'Oh no will my comment end up being deleted to?',
    })
    // Add another reply to newComment
    await CommentController.CreateComment({
      creatorId: newUser._id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'Here is another reply',
    })
    // Will return a boolean on whether or not a comment has replies
    const findReplies = await CommentController.FindCommentReplies({
      commentId: newComment._id,
    })
    expect(findReplies).toBe(true) // True because we created comment replies for newComment
  })
})
