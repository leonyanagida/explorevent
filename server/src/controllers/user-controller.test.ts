import dotenv from 'dotenv'
import faker from 'faker'
import mongoose from 'mongoose'
import request from 'supertest'
import UserController from './user-controller'
import app from '../index'

import User from '../models/user-model'
import Event from '../models/event-model'

dotenv.config()

describe('User controller', () => {
  let req: any
  beforeAll(async () => {
    req = await request(app)
  })
  afterAll(async () => {
    await User.deleteMany({})
    await Event.deleteMany({})
    await mongoose.connection.close() // Close connection to prevent leaking
  })
  afterEach(async () => {
    await User.deleteMany({})
    await Event.deleteMany({})
  })

  it('User controller - Should create a new user', async () => {
    const testEmail = 'text@example.com'
    const testFullName = 'Text Example'
    const testPassword = '123456'
    const testUsername = 'textexample'
    const newUser = await UserController.CreateNewUser({
      email: testEmail,
      fullName: testFullName,
      password: testPassword,
      username: testUsername,
    })
    expect(newUser.email).toBe('text@example.com')
  })

  it('Users cannot have dulplicate emails', async () => {
    const newUser1 = {
      email: 'noduplicateemails@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    const createNewUser1 = await UserController.CreateNewUser(newUser1)
    expect(createNewUser1.email).toBe('noduplicateemails@email.com')
    const newUser2 = {
      email: 'noduplicateemails@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // The controller should reject the promise
    expect(async () => await UserController.CreateNewUser(newUser2)).rejects
  })

  it('Users can edit account details (about, name, username)', async () => {
    const newUser = {
      email: 'editaccountdetails@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Create the new user
    const createNewUser = await UserController.CreateNewUser(newUser)
    expect(createNewUser.email).toBe('editaccountdetails@email.com')
    // Edit the new user
    const editNewUser = await UserController.EditUserDetails({
      about: 'Hello this is my new about page',
      fullName: 'New Fullname',
      username: newUser.username,
      userId: createNewUser._id,
    })
    expect(editNewUser).resolves
    // Find the user and make sure the information has been changed
    const findNewUser = await UserController.FindUserById(createNewUser._id)
    expect(findNewUser?.about).toBe('Hello this is my new about page')
    expect(findNewUser?.fullName).toBe('New Fullname')
  })

  it('Users can edit their password', async () => {
    const newUser = {
      email: 'editaccountpassword@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Create the new user
    const createNewUser = await UserController.CreateNewUser(newUser)
    expect(createNewUser.email).toBe('editaccountpassword@email.com')
    // Edit the new user
    const editNewUser = await UserController.EditUserPassword({
      password: 'newpassword',
      userId: createNewUser._id,
    })
    expect(editNewUser).resolves
    // Find the user and make sure the password has been changed
    const findNewUser = await UserController.FindUserById(createNewUser._id)
    // Make sure the passwords are hashed
    expect(findNewUser?.password).not.toBe('newpassword')
  })

  it('Users can edit their email', async () => {
    const newUser = {
      email: 'editaccountemail@email.com',
      fullName: faker.name.findName(),
      password: faker.internet.password(),
      username: faker.name.firstName() + faker.random.word(),
    }
    // Create the new user
    const createNewUser = await UserController.CreateNewUser(newUser)
    expect(createNewUser.email).toBe('editaccountemail@email.com')
    // Edit the new user
    const editNewUser = await UserController.EditUserEmail({
      email: 'newaccountemail@email.com',
      userId: createNewUser._id,
    })
    expect(editNewUser).resolves
    // Find the user and make sure the email has been changed
    const findNewUser = await UserController.FindUserById(createNewUser._id)
    expect(findNewUser?.email).toBe('newaccountemail@email.com')
  })
})
