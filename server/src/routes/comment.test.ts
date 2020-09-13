import faker from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import User from '../models/user-model'
import Event from '../models/event-model'
import app from '../index'

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

  it('Create Comment', async () => {
    // The agent will hold the app session for the test
    let agent = request.agent(app)

    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'findme2',
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
        eventName: 'Test Event Comments',
        creatorId: newUserSignup.id,
        text: 'Leave comments on this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment
    const newComment = await agent.post('/api/comments/new').send({
      creatorId: newUserSignup.id,
      eventId: newEvent._id,
      replyToId: null,
      text: 'This is a good event post!',
    })
    expect(newComment.status).toBe(200)
  })

  it('Can Edit comment', async () => {
    let agent = request.agent(app)
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'findme2',
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
    // Sign in as the first user
    const userLogin = await agent.post('/api/users/login').send({ email: newUser.email, password: newUser.password })
    expect(userLogin.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventName: 'Test Event Comments',
        creatorId: newUserSignup.id,
        text: 'Leave comments on this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment
    const newComment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: newUserSignup.id,
        eventId: newEvent._id,
        replyToId: null,
        text: 'This is a good event post!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    const editComment = await agent.post('/api/comments/edit').send({
      creatorId: newComment.creatorId,
      commentId: newComment._id,
      text: 'How about an editted comment?',
      userId: newUserSignup.id,
    })
    expect(editComment.status).toBe(200)
  })

  it("Cannot edit other people's comments", async () => {
    let agent = request.agent(app)
    let newUser = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'findme2',
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
        eventName: 'Test Event Comments',
        creatorId: newUserSignup.id,
        text: 'Leave comments on this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment
    const newComment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: newUserSignup.id,
        eventId: newEvent._id,
        replyToId: null,
        text: 'This is a good event post!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    // Logout of the current user
    await agent.get('/api/users/logout')
    // Create 2nd user
    let newUser2 = {
      email: faker.internet.email(),
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'canteditcomment',
    }
    // Sign up the new user
    const newUserSignup2 = await req
      .post('/api/users/signup')
      .send(newUser2)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Log in as the second user
    const userLogin2 = await agent.post('/api/users/login').send({ email: newUser2.email, password: newUser2.password })
    expect(userLogin2.status).toBe(200)

    const editComment = await agent.post('/api/comments/edit').send({
      creatorId: newComment.creatorId,
      commentId: newComment._id,
      text: 'We should not be able to edit this comment',
      userId: newUserSignup2.id,
    })
    expect(editComment.status).toBe(401) // Unauthorized
  })

  it('Can delete comment', async () => {
    let agent = request.agent(app)
    // Create user first
    let newUser = {
      email: 'deletecomment1@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'deletecomment1',
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
        eventName: 'Test Event Comments',
        creatorId: newUserSignup.id,
        text: 'Leave comments on this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment
    const newComment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: newUserSignup.id,
        eventId: newEvent._id,
        replyToId: null,
        text: 'When is this event going to be held?',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    const findUser = await req.get(`/api/users/${newUserSignup.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    const findEvent = await req.get(`/api/events/${newEvent._id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.event
    })
    expect(findUser.userComments.length).toBe(1)
    expect(findEvent.eventComments.length).toBe(1)
    // Comment - Delete the comment
    const deleteComment = await agent.post('/api/comments/delete').send({
      creatorId: newComment.creatorId,
      commentId: newComment._id,
      eventId: newEvent._id,
      userId: newUserSignup.id,
    })
    expect(deleteComment.status).toBe(200)
    // Make sure that the comment was removed from the user's commentsArray
    const findUser2 = await req.get(`/api/users/${newUserSignup.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    expect(findUser2.userComments).not.toContain(newComment._id)
    // Make sure that the comment was removed from the event
    const findEvent2 = await req.get(`/api/events/${newEvent._id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.event
    })
    // Comments should be completely removed from events
    expect(findEvent2.eventComments).not.toContain(newComment._id)
  })

  it('Deletes comments and replies', async () => {
    // Note: A slightly long winded test
    // - We will create 2 users
    // - The first user will create an event and leave a comment
    // - The second user will reply to the first user's comment
    // - Then we will delete user 1's comment
    let agent = request.agent(app)
    // Create user first
    let newUser1 = {
      email: 'commenterdeleter@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'commenterdeleter',
    }
    // Sign up the new user
    const newUserSignup1 = await req
      .post('/api/users/signup')
      .send(newUser1)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    // Sign in as the first user
    const userLogin1 = await agent.post('/api/users/login').send({ email: newUser1.email, password: newUser1.password })
    expect(userLogin1.status).toBe(200)
    // Create the event with the user's id
    const newEvent = await agent
      .post('/api/events/new')
      .send({
        eventName: 'Test Event COmmentS TWO',
        creatorId: newUserSignup1.id,
        text: 'DlewteComments Herer',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment
    const newComment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: newUserSignup1.id,
        eventId: newEvent._id,
        replyToId: null,
        text: 'When is the event going to be held?',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    // Logout of the current user
    await agent.get('/api/users/logout')
    // Create user2
    let newUser2 = {
      email: 'commentdeleter2@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'commentdeleter2',
    }
    // Sign up the new user
    const newUserSignup2 = await req
      .post('/api/users/signup')
      .send(newUser2)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin2 = await agent.post('/api/users/login').send({ email: newUser2.email, password: newUser2.password })
    expect(userLogin2.status).toBe(200)
    await agent.post('/api/comments/new').send({
      creatorId: newUserSignup2.id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'This is a reply to a comment',
    })
    await agent.post('/api/comments/new').send({
      creatorId: newUserSignup2.id,
      eventId: newEvent._id,
      replyToId: newComment._id,
      text: 'This is a reply 2 2222 to a comment',
    })
    // Logout of the current user
    await agent.get('/api/users/logout')
    // Make sure to sign in so we become authenticated
    const user1LoginAgain = await agent
      .post('/api/users/login')
      .send({ email: newUser1.email, password: newUser1.password })
    expect(user1LoginAgain.status).toBe(200)
    // Comment - Delete the comment
    const deleteComment = await agent.post('/api/comments/delete').send({
      creatorId: newComment.creatorId,
      commentId: newComment._id,
      eventId: newEvent._id,
      userId: newComment.creatorId,
    })
    expect(deleteComment.status).toBe(200)
    const findUser1 = await req.get(`/api/users/${newUserSignup1.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    expect(findUser1.userComments).not.toContain(newComment._id)
    const findUser2 = await req.get(`/api/users/${newUserSignup2.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    // The replies left by other users will remain, but, will NOT be accessible
    expect(findUser2.userComments.length).toBe(2)
    const findEvent2 = await req.get(`/api/events/${newEvent._id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.event
    })
    expect(findEvent2.eventComments).not.toContain(newComment._id)
  })

  it('Comment can be liked by another user', async () => {
    let agent = request.agent(app)
    // Create user first
    let newUser1 = {
      email: 'usercommentliker@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'commentdeleter2',
    }
    // Sign up the new user
    const newUserSignup1 = await req
      .post('/api/users/signup')
      .send(newUser1)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin1 = await agent.post('/api/users/login').send({ email: newUser1.email, password: newUser1.password })
    expect(userLogin1.status).toBe(200)
    // We need to create an event first before we can leave a comment
    // Create the event with userOne's account
    const userOneNewEvent = await agent
      .post('/api/events/new')
      .send({
        eventName: 'Test Event Comments',
        creatorId: newUserSignup1.id,
        text: 'Leave comments on this event!',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.event
      })
    // Create a new comment with userOne's account
    const userOneNewComment = await agent
      .post('/api/comments/new')
      .send({
        creatorId: newUserSignup1.id,
        eventId: userOneNewEvent._id,
        replyToId: null,
        text: 'How many days will the event go for?',
      })
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body.comment
      })
    // Logout of the current user
    await agent.get('/api/users/logout')
    // Then create a second user that will like user's one comment
    let newUser2 = {
      email: 'usercommentanotheruser@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: 'usercommentanotheruser',
    }
    // Sign up the new user
    const newUserSignup2 = await req
      .post('/api/users/signup')
      .send(newUser2)
      .then((res: any) => {
        expect(res.status).toBe(200)
        return res.body
      })
    // Make sure to sign in so we become authenticated
    const userLogin2 = await agent.post('/api/users/login').send({ email: newUser2.email, password: newUser2.password })
    expect(userLogin2.status).toBe(200)
    // User2 will like User1's comment
    await agent.post('/api/comments/togglelike').send({
      commentId: userOneNewComment._id,
      userId: newUserSignup2.id,
    })
    // Find user2
    const findUser2 = await req.get(`/api/users/${newUserSignup2.id}`).then((res: any) => {
      expect(res.status).toBe(200)
      return res.body.user
    })
    // Make sure user2 has a likedComments array contains the comment
    expect(findUser2.likedComments.length).toBe(1)
  })
})
