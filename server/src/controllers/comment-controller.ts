import Comment, { IComment } from '../models/comment-model'
import { IEvent } from '../models/event-model'
import { IUser } from '../models/user-model'

interface ICreateCommentInput {
  creatorId: IUser['_id']
  eventId: IEvent['_id']
  replyToId: IComment['_id']
  text: IEvent['text']
}

async function CreateComment({ creatorId, eventId, replyToId, text }: ICreateCommentInput): Promise<IComment> {
  return new Promise((resolve, reject) => {
    try {
      return Comment.create({
        commentLikes: [],
        creatorId,
        eventId,
        published: true,
        replyToId,
        text,
      }).then((data: IComment) => {
        return resolve(data)
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function EditComment({ commentId, text }: { commentId: string; text: string }): Promise<IComment | null> {
  return new Promise((resolve, reject) => {
    Comment.findByIdAndUpdate(commentId, { text: text }).exec((err, res) => {
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

async function FindCommentReplies({ commentId }: { commentId: string }) {
  return new Promise((resolve, reject) => {
    // First find if the original comment has replys
    Comment.find({ replyToId: commentId })
      .then((findCommentReplies) => {
        if (findCommentReplies.length > 0) {
          return resolve(true)
        } else {
          return resolve(false)
        }
      })
      .catch((err) => reject(err))
  })
}

async function DeleteComment({ commentId }: { commentId: string }) {
  return new Promise((resolve, reject) => {
    // First find if the original comment has replys
    Comment.find({ replyToId: commentId }).then((findCommentReplies) => {
      // Check to see if the comments object contains any replys
      if (findCommentReplies.length > 0) {
        let deleteIds = findCommentReplies.map((id) => id._id)
        // We are deleting all the replies to the orginal comment first
        Comment.deleteMany({ _id: deleteIds }).exec()
        // Then we are deleting the original comment next
        Comment.findByIdAndDelete(commentId).exec((err, res) => {
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
        // If no replies are found, simply delete the original comment
        Comment.findByIdAndDelete(commentId).exec((err, res) => {
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

async function DeletedAccountEditCommentById(userId: string): Promise<IComment | null> {
  return new Promise((resolve, reject) => {
    // First find if the original comment has replys
    Comment.find({ creatorId: userId }).then((findComments) => {
      // Check to see if the comments object contains any replys
      if (findComments.length >= 1) {
        Comment.updateMany({ creatorId: userId }, { text: '[deleted]', published: false }).exec((err, res) => {
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
        Comment.deleteMany({ creatorId: userId }).exec((err, res) => {
          if (err) {
            reject(err)
          } else {
            if (res) {
              resolve(null)
            } else {
              resolve(null)
            }
          }
        })
      }
    })
  })
}

async function FindCommentById(commentId: string): Promise<IComment | null> {
  return new Promise((resolve, reject) => {
    try {
      Comment.findById(commentId).exec((err, res) => {
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

async function FindAllComments() {
  return new Promise((resolve, reject) => {
    try {
      return Comment.find().exec((err, res) => {
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

async function ToggleCommentLike({
  commentId,
  userId,
}: {
  commentId: string
  userId: string
}): Promise<IComment | null> {
  return new Promise((resolve, reject) => {
    Comment.findById(commentId, (err, comment) => {
      if (comment?.commentLikes.includes(userId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterCommentLikes = comment?.commentLikes.filter((id: any) => {
          return id != userId
        })
        // Set the new array with the removed userId
        Comment.findByIdAndUpdate(commentId, { commentLikes: filterCommentLikes }).exec((err, res) => {
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
        Comment.findByIdAndUpdate(commentId, { commentLikes: [...comment?.commentLikes, userId] }).exec((err, res) => {
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

export default {
  CreateComment,
  DeletedAccountEditCommentById,
  DeleteComment,
  FindAllComments,
  FindCommentById,
  FindCommentReplies,
  EditComment,
  ToggleCommentLike,
}
