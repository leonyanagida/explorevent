import User, { IUser } from '../models/user-model'

interface ICreateNewUserInput {
  email: IUser['email']
  fullName: IUser['fullName']
  password: IUser['password']
  username: IUser['username']
}

async function CreateNewUser({ email, fullName, password, username }: ICreateNewUserInput): Promise<IUser> {
  return new Promise((resolve, reject) => {
    User.create({
      about: '',
      admin: false,
      attendedEvents: [],
      attendingEvents: [],
      banned: false,
      likedComments: [],
      likedEvents: [],
      createdEvents: [],
      email: email,
      fullName: fullName,
      password: password,
      username: username,
      userComments: [],
    })
      .then((data: IUser) => {
        return resolve(data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

async function UserLogin({ email }: { email: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      }
    })
  })
}

async function EditUserDetails({
  about,
  fullName,
  username,
  userId,
}: {
  about: string
  fullName: string
  username: string
  userId: string
}): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(userId, { about: about, fullName: fullName, username: username }).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      }
    })
  })
}

async function EditUserPassword({ password, userId }: { password: string; userId: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, { password: password }).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      }
    })
  })
}

async function EditUserEmail({ email, userId }: { email: string; userId: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(userId, { email: email }).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      }
    })
  })
}

async function DeleteUserById(userId: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findById({ _id: userId }).then((user) => {
      user
        ?.remove()
        .then(() => {
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

async function UserDeleteComment({ commentId, userId }: { commentId: string; userId: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findById(userId, { userComments: commentId }, (err, user) => {
      let userArr = user?.userComments
      // Remove the comment id from the user's comment array
      for (let i = userArr.length - 1; i >= 0; --i) {
        if (userArr[i] == commentId) {
          userArr.splice(i, 1)
        }
      }
      User.findByIdAndUpdate(userId, { userComments: userArr }).exec((err, res) => {
        if (err) {
          reject(err)
        } else {
          if (res) {
            resolve(res)
          } else {
            resolve(null)
          }
        }
      })
    })
  })
}

async function UserToggleCommentLike({
  commentId,
  userId,
}: {
  commentId: string
  userId: string
}): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findById(userId, { likedComments: userId }, (err, user) => {
      if (user?.likedComments.includes(userId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterLikedComments = user?.likedComments.filter((id: any) => {
          return id != userId
        })
        // Set the new array with the removed userId
        User.findByIdAndUpdate(userId, { likedComments: filterLikedComments }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      } else {
        User.findByIdAndUpdate(userId, { likedComments: [...user?.likedComments, commentId] }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      }
    })
  })
}

async function UserToggleEventLike({ eventId, userId }: { eventId: string; userId: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findById(userId, { likedEvents: userId }, (err, user) => {
      if (user?.likedEvents.includes(eventId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterLikedEvents = user?.likedEvents.filter((id: any) => {
          return id != eventId
        })
        // Set the new array with the removed userId
        User.findByIdAndUpdate(userId, { likedEvents: filterLikedEvents }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      } else {
        User.findByIdAndUpdate(userId, { likedEvents: [...user?.likedEvents, eventId] }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      }
    })
  })
}

async function UserToggleEventAttend({ eventId, userId }: { eventId: string; userId: string }): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    User.findById(userId, { attendingEvents: eventId }, (err, user) => {
      if (user?.attendingEvents.includes(userId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterAttendingEvents = user?.attendingEvents.filter((id: any) => {
          return id != userId
        })
        // Set the new array with the removed userId
        User.findByIdAndUpdate(userId, { attendingEvents: filterAttendingEvents }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      } else {
        User.findByIdAndUpdate(userId, { attendingEvents: [...user?.attendingEvents, eventId] }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      }
    })
  })
}

async function UpdateUserCreateEvent({
  creatorId,
  eventId,
}: {
  creatorId: string
  eventId: string
}): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      User.findById(creatorId).then((findUser) => {
        User.findByIdAndUpdate(creatorId, { createdEvents: [...findUser?.createdEvents, eventId] }) // Pass in the eventId into the createdEvents array
          .exec((err, res) => {
            if (err) {
              reject(err)
            } else {
              if (res) {
                resolve(res)
              } else {
                resolve(null)
              }
            }
          })
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function UpdateUserCreateComment({
  userId,
  commentId,
}: {
  userId: string
  commentId: string
}): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      User.findById(userId).then((findUser) => {
        User.findByIdAndUpdate(userId, { userComments: [...findUser?.userComments, commentId] }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function FindUserAll() {
  return new Promise((resolve, reject) => {
    try {
      User.find()
        .populate('createdEvents')
        .exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

async function FindUserById(id: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      return User.findById(id)
        .populate('createdEvents', 'username')
        .exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

async function FindUserProfileById(id: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      return User.findById(id)
        .populate('createdEvents')
        .exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

async function FindUserByUsername(username: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      return User.findOne({ username: username })
        .limit(1)
        .exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

async function FindUserByEmail(email: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email: email })
        .populate('createdEvents')
        .exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(res)
            } else {
              resolve(null)
            }
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  CreateNewUser,
  DeleteUserById,
  EditUserDetails,
  EditUserEmail,
  EditUserPassword,
  FindUserAll,
  FindUserById,
  FindUserProfileById,
  FindUserByEmail,
  FindUserByUsername,
  UserToggleCommentLike,
  UserToggleEventLike,
  UserToggleEventAttend,
  UpdateUserCreateComment,
  UpdateUserCreateEvent,
  UserDeleteComment,
  UserLogin,
}
