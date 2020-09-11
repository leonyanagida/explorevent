import faker, { fake } from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import User from '../models/user-model'
import Event from '../models/event-model'
import app from '../index'
import * as fs from 'fs'
import * as path from 'path'

// import '../testImgs/typescript.png'

describe('Event Route', () => {
  let req: any
  beforeAll(async () => {
    req = await request(app)
  })
  afterAll(async () => {
    await User.deleteMany({})
    await Event.deleteMany({})
    await mongoose.connection.close()
  })
  afterEach(async () => {
    await User.deleteMany({})
    await Event.deleteMany({})
  })

  // it('upload event image', async () => {
  //   const filePath = path.join(__dirname, '../testImgs/typescript.png')
  //   await req
  //     .post('/api/events/upload')
  //     // Attach the file with key 'file' which is corresponding to your endpoint setting.
  //     .attach('file', filePath)
  //     .then((res: any) => {
  //       expect(typeof filePath).toBeTruthy()
  //       expect(res.status).toBe(200)
  //     })
  // })

  it('Able to add/edit event images', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventName: 'Edit Event Image',
        creatorId: newUserSignup.id,
        text: 'Add an image to this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    const filePath = path.join(__dirname, '../testImgs/typescript.png')
    await agent
      .post('/api/events/upload')
      // Attach the file with key 'file' which is corresponding to your endpoint setting.
      .attach('file', filePath)
      .field('eventId', newEvent._id)
      .then((res: any) => {
        expect(typeof filePath).toBeTruthy()
        expect(res.status).toBe(200)
      })
  })

  it('Create event', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent.post('/api/events/new').send({
      eventName: 'Test Event',
      creatorId: newUserSignup.id,
      text: 'Hi this is a new event!',
    })
    expect(newEvent.status).toBe(200)
  })

  it('Can edit event', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventName: 'Test Event',
        creatorId: newUserSignup.id,
        text: 'Hi this is a new event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    const editEvent = await agent.post(`/api/events/${newEvent._id}/edit`).send({
      creatorId: newUserSignup.id,
      eventDate: [],
      eventHours: [],
      eventId: newEvent._id,
      eventName: 'A new event name',
      exclusive: false,
      text: 'I updated the event text',
    })
    expect(editEvent.status).toBe(200)
    const findEvent = await req.get(`/api/events/${newEvent._id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.event
    })
    expect(findEvent.eventName).toBe('A new event name')
  })

  it('Create event and populate user', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent.post('/api/events/new').send({
      eventName: 'Test Event',
      creatorId: newUserSignup.id,
      text: 'Hi this is a new event!',
    })
    expect(newEvent.status).toBe(200)
    const findUserByIdWithEvents = await agent.get(`/api/users/${newUserSignup.id}`)
    expect(findUserByIdWithEvents.status).toBe(200)
    const findUserById = await req.get(`/api/users/${newUserSignup.id}`)
    expect(findUserById.body.user.createdEvents.length).toBe(1)
  })

  it('Event can be liked by user', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create a new event
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventAddress: '',
        eventCity: '',
        eventState: '',
        eventZip: '',
        eventStartDate: '2022-01-01',
        eventEndDate: '2022-01-01',
        eventStartTime: '15:40',
        eventEndTime: '15:40',
        online: true,
        eventName: 'Test Event',
        creatorId: newUserSignup.id,
        text: 'Hi this is a new event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // The same user that created the event will like the event
    await agent.post(`/api/events/${newEvent._id}/togglelike`).send({
      userId: newUserSignup.id,
    })
    // Make sure the user comments array contains the comment that we just created
    const findUser = await agent.get(`/api/users/${newUserSignup.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    expect(findUser.likedEvents.length).toBe(1)
  })

  it('Event can be unliked by user', async () => {
    let agent = request.agent(app)
    // New user object
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up the new user
    const newUserSignup = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create a new event
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventAddress: '',
        eventCity: '',
        eventState: '',
        eventZip: '',
        eventStartDate: '2022-01-01',
        eventEndDate: '2022-01-01',
        eventStartTime: '15:40',
        eventEndTime: '15:40',
        online: true,
        eventName: 'Unlike Event',
        creatorId: newUserSignup.id,
        text: 'Hi this is a new event that you should unlike!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // The same user that created the event will LIKE the event
    await agent.post(`/api/events/${newEvent._id}/togglelike`).send({
      userId: newUserSignup.id,
    })
    // We will now UNLIKE comment
    await agent.post(`/api/events/${newEvent._id}/togglelike`).send({
      userId: newUserSignup.id,
    })
    const findUser = await req.get(`/api/users/${newUserSignup.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    expect(findUser.likedEvents.length).toBe(0)
  })

  it('Event Route - Get All Events', async () => {
    const getAllEvents = await req.get('/api/events')
    expect(getAllEvents.status).toBe(200)
  })
})
