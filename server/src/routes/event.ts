import express, { Request, Response } from 'express'
import multer from 'multer'
// Config files
import * as passportConfig from '../config/passport'
// Controllers
import UserController from '../controllers/user-controller'
import EventController from '../controllers/event-controller'
// Middleware
import { textModerationHandler } from '../middleware/textmoderation-middleware'
import { deleteMiddleware, uploadMiddleware } from '../middleware/dropbox-middleware'

export const eventRouter = express.Router()

// We using multer to handle uploading images
const upload = multer()

eventRouter.post('/:eventId/toggleattend', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    await EventController.ToggleEventAttend({
      eventId: req.params.eventId,
      userId: req.body.userId,
    })
    await UserController.UserToggleEventAttend({
      eventId: req.params.eventId,
      userId: req.body.userId,
    })
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Error attending/unattending post' })
  }
})

eventRouter.post('/:eventId/togglelike', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    // Event - Like or Unlike event
    await EventController.ToggleEventLike({
      eventId: req.params.eventId,
      userId: req.body.userId,
    })
    // User - Like or Unlike event
    await UserController.UserToggleEventLike({
      eventId: req.params.eventId,
      userId: req.body.userId,
    })
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Error liking/unliking event' })
  }
})

eventRouter.post(
  '/:eventId/edit',
  passportConfig.loggedInOnly,
  // textModerationHandler,
  async (req: Request, res: Response) => {
    try {
      // We have to make sure that only the creator can edit the comment
      if (req.body.creatorId !== req.session?.passport.user) {
        return res.status(401).send() // Send an unauthorized
      }
      const event = await EventController.EditEventById({
        eventDate: [], // For future use
        eventHours: [], // For future use
        eventId: req.params.eventId,
        eventName: req.body.eventName,
        eventAddress: req.body.eventAddress,
        eventCity: req.body.eventCity,
        eventState: req.body.eventState,
        eventZip: req.body.eventZip,
        eventStartDate: req.body.eventStartDate,
        eventEndDate: req.body.eventEndDate,
        eventStartTime: req.body.eventStartTime,
        eventEndTime: req.body.eventEndTime,
        online: req.body.online,
        text: req.body.text,
      })
      return res.status(200).send({ event })
    } catch (err) {
      return res.status(400).send({ error: err, message: 'Unable to edit event' })
    }
  }
)

eventRouter.post('/new', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    const event = await EventController.CreateNewEvent({
      eventAddress: req.body.eventAddress,
      eventCity: req.body.eventCity,
      eventState: req.body.eventState,
      eventZip: req.body.eventZip,
      eventStartDate: req.body.eventStartDate,
      eventEndDate: req.body.eventEndDate,
      eventStartTime: req.body.eventStartTime,
      eventEndTime: req.body.eventEndTime,
      online: req.body.online,
      eventName: req.body.eventName,
      creatorId: req.body.creatorId,
      text: req.body.text,
    })
    // Make sure insert the new event into user
    await UserController.UpdateUserCreateEvent({ creatorId: req.body.creatorId, eventId: event._id })
    return res.status(200).send({ event })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to create new event' })
  }
})

// Make sure to use the multer middleware(upload.single('file)) before the uploadMiddleware
eventRouter.post(
  '/upload',
  passportConfig.loggedInOnly,
  upload.single('file'),
  uploadMiddleware,
  async (req: Request, res: Response) => {
    try {
      // The imgName is created in the uploadMiddleware
      const { imgName } = res.locals
      const event = await EventController.EditEventImg({ eventId: req.body.eventId, eventImg: imgName })
      return res.status(200).send({ event })
    } catch (err) {
      return res.status(400).send({ error: err, message: 'Unable to upload new image' })
    }
  }
)

// Clear the img from the event
eventRouter.post('/upload/delete', async (req: Request, res: Response) => {
  try {
    await EventController.DeleteEventImg({ eventId: req.body.eventId })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to delete image' })
  }
})

eventRouter.post('/delete', passportConfig.loggedInOnly, async (req: Request, res: Response) => {
  try {
    // We have to make sure that only the creator can delete the event
    if (req.body.creatorId !== req.session?.passport.user) {
      return res.status(401).send() // Send an unauthorized error status
    }
    // Event - Delete
    await EventController.DeleteEvent({ eventId: req.body.eventId })
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to delete event' })
  }
})

eventRouter.post('/delete/img', passportConfig.loggedInOnly, deleteMiddleware, async (req: Request, res: Response) => {
  // Make sure to send { eventImg: 'asdasdasdsda.jpg } for the deleteMiddleware
  try {
    // If it made past the middleware, it was a success deleting the img
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to delete image' })
  }
})

// Event Search
eventRouter.get('/search/:eventSearch', async (req: Request, res: Response) => {
  try {
    // Get event by search for the name
    const event = await EventController.FindEventNameSearch(req.params.eventSearch)
    return res.status(200).send({ event })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'No results found!' })
  }
})

eventRouter.get('/:eventId', async (req: Request, res: Response) => {
  try {
    // Get event by id
    const event = await EventController.FindEventById(req.params.eventId)
    return res.status(200).send({ event })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to find event' })
  }
})

eventRouter.get('/', async (req: Request, res: Response) => {
  try {
    // Get event by id
    const event = await EventController.FindAllEvents()
    return res.status(200).send({ event })
  } catch (err) {
    return res.status(400).send({ error: err, message: 'Unable to get all events' })
  }
})
