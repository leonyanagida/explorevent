import express, { Request, Response, NextFunction } from 'express'
import * as passportConfig from '../config/passport'
// Import controllers
import CommentController from '../controllers/comment-controller'
import EventController from '../controllers/event-controller'
import UserController from '../controllers/user-controller'
// Import middleware
import { textModerationHandler } from '../middleware/textmoderation-middleware'

export const commentRouter = express.Router()

commentRouter.post('/edit', passportConfig.loggedInOnly, textModerationHandler, async (req: Request, res: Response) => {
  try {
    // We have to make sure that only the creator can edit the comment
    if (req.body.creatorId !== req.session?.passport.user) {
      return res.status(401).send() // Send an unauthorized
    }
    const comment = await CommentController.EditComment({ commentId: req.body.commentId, text: req.body.text })
    return res.status(200).send({ comment })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new comment' })
  }
})

commentRouter.post('/new', textModerationHandler, async (req: Request, res: Response) => {
  try {
    const comment = await CommentController.CreateComment({
      creatorId: req.body.creatorId,
      eventId: req.body.eventId,
      replyToId: req.body.replyToId,
      text: req.body.text,
    })
    // Make sure insert the new event into user
    await UserController.UpdateUserCreateComment({ userId: req.body.creatorId, commentId: comment._id })
    // Make sure insert the new event into event
    await EventController.UpdateEventCreateComment({ eventId: req.body.eventId, commentId: comment._id })
    return res.status(200).send({ comment })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new comment' })
  }
})

commentRouter.post('/togglelike', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    // Comment - Like or Unlike Comment
    await CommentController.ToggleCommentLike({
      commentId: req.body.commentId,
      userId: req.body.userId,
    })
    // User - Like or Unlike Comment
    await UserController.UserToggleCommentLike({
      commentId: req.body.commentId,
      userId: req.body.userId,
    })
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Error liking/unliking comment' })
  }
})

commentRouter.post('/delete', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    // We have to make sure that only the creator can edit the comment
    if (req.body.creatorId !== req.session?.passport.user) {
      return res.status(401).send() // Send an unauthorized error status
    }
    // Comment - Delete comment
    await CommentController.DeleteComment({ commentId: req.body.commentId })
    // Event - Delete comment from event's eventComments
    await EventController.DeleteEventComment({
      commentId: req.body.commentId,
      eventId: req.body.eventId,
    })
    //User - Delete comment from user's userComments
    await UserController.UserDeleteComment({
      commentId: req.body.commentId,
      userId: req.body.userId,
    })
    // }
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new comment' })
  }
})

commentRouter.get('/:commentId', async (req: Request, res: Response) => {
  try {
    // Comment - find comment by its id
    const comment = await CommentController.FindCommentById(req.body.commentId)
    return res.status(200).send({ comment })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new comment' })
  }
})

commentRouter.get('/', async (req: Request, res: Response) => {
  try {
    // Comment - Find all comments
    const comment = await CommentController.FindAllComments()
    return res.status(200).send({ comment })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new comment' })
  }
})
