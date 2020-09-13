import dotenv from 'dotenv'
import faker from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import EventController from './event-controller'
import UserController from './user-controller'
import app from '../index'

import User from '../models/user-model'
import Event from '../models/event-model'

dotenv.config()

describe('Event Controller', () => {
  let req: any // App must be required in order for the tests to work
  // Create a new user so we can create and event with a creatorId
  let newUser: any

  beforeAll(async () => {
    // supertest is required to connect to local mongoose database!
    req = await request(app)
    const testEmail = 'imleon@email.com'
    const testFullName = 'Leon Hello'
    const testPassword = 'AStrongPassword000~'
    const testUsername = 'imleon'
    // Create new user before tests run
    newUser = await UserController.CreateNewUser({
      email: testEmail,
      fullName: testFullName,
      password: testPassword,
      username: testUsername,
    })
  })
  afterAll(async () => {
    // Remove all users everytime we re-run tests
    await User.deleteMany({})
    await Event.deleteMany({})
    // Close connection to prevent leaking
    await mongoose.connection.close()
  })

  it('Event Controller - Creates and event', async () => {
    // Simply create a new event
    // Create a new event to leave comments on
    const newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: "Leon's New Job",
      creatorId: newUser._id,
      text: 'Wow Leon is going for a job.....',
    })
    expect(newEvent.text).toBe('Wow Leon is going for a job.....')
  })

  it('Create and event and find by the Id', async () => {
    // We want to create a new event first and find that event with its id
    const newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: faker.random.words(5),
      creatorId: newUser._id,
      text: 'Test event',
    })
    expect(newEvent.text).toBe('Test event')
    // Find the new event with the id
    const findEventById = await EventController.FindEventById(newEvent._id)
    expect(findEventById?.text).toBe('Test event')
  })

  it('Can Like Event', async () => {
    const newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: faker.random.words(5),
      creatorId: newUser._id,
      text: 'Like My Event Please',
    })
    expect(newEvent.text).toBe('Like My Event Please')
    // Make sure to add or remove the user from the event's usersAttending array
    await EventController.ToggleEventLike({ eventId: newEvent._id, userId: newEvent.creatorId })
    // Find the toggled event
    const findToggledEvent = await EventController.FindEventById(newEvent._id)
    expect(findToggledEvent?.eventLikes.length).toBe(1)
    // Make sure the user's attending events array contains the eventId
    await UserController.UserToggleEventLike({ eventId: newEvent._id, userId: newEvent.creatorId })
    const findToggledEventUser = await UserController.FindUserById(newEvent.creatorId)
    expect(findToggledEventUser?.likedEvents.length).toBe(1)
  })

  it('Can Unlike Event', async () => {
    const newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: faker.random.words(5),
      creatorId: newUser._id,
      text: 'Like My Event Please 2',
    })
    expect(newEvent.text).toBe('Like My Event Please 2')
    // LIKE the event first
    await EventController.ToggleEventAttend({
      eventId: newEvent._id,
      userId: newEvent.creatorId,
    })
    const initialToggleEvent = await EventController.FindEventById(newEvent._id)
    expect(initialToggleEvent?.usersAttending.length).toBe(1) // Make sure the user has liked the event firstt
    // Then UNLIKE the event
    await EventController.ToggleEventAttend({
      eventId: newEvent._id,
      userId: newEvent.creatorId,
    })
    // Find the event to make sure the user was removed from the userAttending array
    const findToggledEvent = await EventController.FindEventById(newEvent._id)
    expect(findToggledEvent?.eventLikes.length).toBe(0)
  })

  it('Can edit event', async () => {
    // Create a new event first
    const newEvent = await EventController.CreateNewEvent({
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: faker.random.words(5),
      creatorId: newUser._id,
      text: 'Please edit my event',
    })
    expect(newEvent.text).toBe('Please edit my event')
    // Edit the event first
    const editNewEvent = await EventController.EditEventById({
      eventDate: {},
      eventHours: {},
      eventAddress: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      eventStartDate: '2022-01-01',
      eventEndDate: '2022-01-01',
      eventStartTime: '15:40',
      eventEndTime: '15:40',
      online: true,
      eventName: 'This is a new event name',
      text: 'This is a new event text',
      eventId: newEvent._id,
    })
    const findEditedEvent = await EventController.FindEventById(editNewEvent?._id)
    expect(findEditedEvent?.text).toBe('This is a new event text')
  })
})
