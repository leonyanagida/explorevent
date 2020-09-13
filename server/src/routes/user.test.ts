import faker from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import User from '../models/user-model'
import Event from '../models/event-model'
import app from '../index'
import { create } from 'domain'

describe('User Route', () => {
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

  it('Should be able to create new user ', async () => {
    let newUser = {
      email: 'John@email.com',
      fullName: 'John Smith',
      password: faker.internet.password(),
      username: 'johnsmith',
    }
    const createNewUserRoute = await req.post('/api/users/signup').send(newUser)
    expect(createNewUserRoute.status).toBe(200)
  })

  it('Should be able to login', async () => {
    let newUser = {
      email: 'loginmein@email.com',
      fullName: 'LogMe In',
      password: faker.internet.password(),
      username: 'loginmein',
    }
    const createNewUserRoute = await req.post('/api/users/signup').send(newUser)
    expect(createNewUserRoute.status).toBe(200)
    // Login
    const userLogin = await req.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
  })

  it('Should fail to find by username (Not Authenticated)', async () => {
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'authuser',
    }
    // Sign up the new user
    await req.post('/api/users/signup').send(newUser)
    // Trying to find the user without authentication will fail
    const failFindUser = await req.get(`/api/users/username/${newUser.username}`)
    expect(failFindUser.status).toBe(401)
  })

  it('Should find the user by username (Authenticated)', async () => {
    // The agent will hold the app session for the test
    let agent = request.agent(app)
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'findme',
    }
    // Sign up the new user
    await req.post('/api/users/signup').send(newUser)
    // Make sure to sign in so we become authenticated
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Trying to find the user without authentication will fail
    const findUser = await agent.get(`/api/users/username/${newUser.username}`)
    expect(findUser.status).toBe(200)
  })

  // it('User Route - GET user by id to FAIL (No Auth)', async () => {
  // const findBadUserByIdRoute = await req.get('/api/users/2342353erwedf')
  // expect(findBadUserByIdRoute.status).toBe(401)
  // expect(findBadUserByIdRoute.body.message).toBe('Unable to find user')
  // })

  it('User can GET user by id', async () => {
    // Create a new user
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up user
    const createNewUserRoute = await req.post('/api/users/signup').send(newUser)
    expect(createNewUserRoute.status).toBe(200)
    // Find the user we just signed up
    const findGoodUserByIdRoute = await req.get(`/api/users/${createNewUserRoute.body.id}`)
    expect(findGoodUserByIdRoute.status).toBe(200)
  })

  it('Can delete user', async () => {
    let agent = request.agent(app)
    let newUser = {
      email: 'deleteme@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'deleteme',
    }
    // Sign up user
    const createNewUserRoute = await req.post('/api/users/signup').send(newUser)
    expect(createNewUserRoute.status).toBe(200)
    // Sign in as the new user
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Delete the new user
    const deleteNewUser = await agent.post('/api/users/delete').send({ userId: createNewUserRoute.body.id })
    expect(deleteNewUser.status).toBe(200)
    // We should not be able to find the user because we just deleted it
    const badFindUser = await req.get(`/api/users/${createNewUserRoute.body.id}`)
    expect(badFindUser.body.user).toBeNull()
  })

  it('Deletes user with multiple posts and comments', async () => {
    // Note: This test is a bit long, could be sperated into different tests
    // - We will create 2 new users
    // - The first user will create an event
    // - The second user will leave a comment on the first event
    // - Then we will delete user1's account
    // - All of user1's events should be deleted.
    // - Comments that have replies should remain
    //
    // The agent will persist its requests and cookies
    let agent = request.agent(app)
    //
    //
    // =================== User 1 =================== //
    // Create a new user 1
    let newUser = {
      email: 'newwuser1@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'newuser1',
    }
    // Sign up user
    const createNewUserRoute = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    expect(createNewUserRoute.username).toBe('newuser1')
    // Sign in as the first user
    const user1Login = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(user1Login.status).toBe(200)
    // Create the event with the user's id
    const user1NewEvent = await agent
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
        creatorId: createNewUserRoute.id,
        text: 'Well we might delete this...',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    const user1Comment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: createNewUserRoute.id,
        eventId: user1NewEvent._id,
        replyToId: null,
        text: 'I did not think that you would delete that event',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    const user1Logout = await agent.get('/api/users/logout')
    expect(user1Logout.status).toBe(200)
    // =================== User 1 =================== //
    //
    //
    // =================== User 2 =================== //
    // Create a new user 2
    let newUser2 = {
      email: 'newwuser2@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'newuser2',
    }
    // Sign up user
    const createNewUserRoute2 = await req
      .post('/api/users/signup')
      .send(newUser2)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    expect(createNewUserRoute2.username).toBe('newuser2')
    // Sign in as the second user
    const user2Login = await agent.post('/api/users/login').send({ email: newUser2.email, password: newUser2.password })
    expect(user2Login.status).toBe(200)
    // User2 will reply to user1's comment
    await agent
      .post('/api/comments/new')
      .send({
        creatorId: createNewUserRoute2.id,
        eventId: user1NewEvent._id,
        replyToId: user1Comment._id,
        text: 'Hi this is a new comment by user 2',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    // Logout of the second user
    const user2Logout = await agent.get('/api/users/logout')
    expect(user2Logout.status).toBe(200)
    // =================== User 2 =================== //
    //
    //
    // =================== User 1 =================== //
    // Sign in as the first user
    const user1LoginLast = await agent
      .post('/api/users/login')
      .send({ email: newUser.email, password: newUser.password })
    expect(user1LoginLast.status).toBe(200)
    // Delete User1
    const deleteNewUser = await agent.post('/api/users/delete').send({ userId: createNewUserRoute.id })
    expect(deleteNewUser.status).toBe(200)
    // =================== User 1 =================== //
    //
    //
    // Find to see if the event has been properly updated
    const findEvent = await req.get(`/api/events/${user1NewEvent._id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.event
    })
    expect(findEvent.eventComments.length).toBe(0)
    expect(findEvent.eventLikes.length).toBe(0)
    expect(findEvent.usersAttending.length).toBe(0)
    expect(findEvent.eventName).toBe('[Event has been deleted]')
    expect(findEvent.text).toBe('[deleted]')
  })

  it('User can edit account details (about, name, username)', async () => {
    let agent = request.agent(app)
    // Create a new user
    let newUser = {
      email: 'newwuser@email.com',
      fullName: 'Change Me',
      password: 'AStrongPassword000-~!',
      username: 'newuser2',
    }
    // Sign up user
    const createNewUserRoute = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    expect(createNewUserRoute.username).toBe('newuser2')
    // Sign in as the user
    const user2Login = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(user2Login.status).toBe(200)
    // Edit the about, fullname and username
    const editUser = await agent.post('/api/users/edit/details').send({
      about: 'Hello this is my new about page',
      fullName: 'New Name',
      username: 'newusername',
      userId: createNewUserRoute.id,
    })
    expect(editUser.status).toBe(200)
  })

  it('User can change account email', async () => {
    let agent = request.agent(app)
    // Create a new user
    let newUser = {
      email: 'changemyemail@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up user
    const createNewUserRoute = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    expect(createNewUserRoute.email).toBe('changemyemail@email.com')
    // Sign in as the user
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Edit the about, fullname and username
    const editUser = await agent.post('/api/users/edit/email').send({
      email: 'mynewemail@email.com',
      userId: createNewUserRoute.id,
    })
    expect(editUser.status).toBe(200)
  })

  it('User can change account password', async () => {
    let agent = request.agent(app)
    // Create a new user
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Sign up user
    const createNewUserRoute = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Sign in as the user
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Edit the about, fullname and username
    const editUser = await agent.post('/api/users/edit/password').send({
      password: faker.internet.password(),
      userId: createNewUserRoute.id,
    })
    expect(editUser.status).toBe(200)
  })

  it('Get User by Email', async () => {
    let newUser = {
      email: 'getuseremail@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'getuseremail',
    }
    // Sign up user
    const createNewUserRoute = await req
      .post('/api/users/signup')
      .send(newUser)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    const findUserByEmail = await req.get(`/api/users/email/${createNewUserRoute.email}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body
    })
    expect(findUserByEmail.email).toBe('getuseremail@email.com')
  })

  it('User Route - Get all users', async () => {
    // Make a bunch of fake users
    for (let i = 0; i < 10; i++) {
      let newUser = {
        email: faker.internet.email(),
        fullName: faker.name.findName(),
        password: faker.internet.password(),
        username: faker.name.firstName + faker.random.word(),
      }
      await req.post('/api/users/signup').send(newUser)
    }
    // Get all the users
    const findUserAllRoute = await req.get('/api/users/')
    expect(findUserAllRoute.status).toBe(200)
  })
})
