import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const eventCommentStyles = makeStyles((theme) => ({
  commentContainer: {
    marginBottom: '-1em',
  },
  commentDeleteBtn: {
    marginLeft: '-0.6em',
  },
  commentReplyContainer: {
    paddingLeft: '2em',
  },
  eventCommentSnackbar: {
    maxWidth: 300,
    margin: 'auto',
  },
  nameDate: {
    display: 'flex',
  },
  userComment: {
    marginTop: 0,
  },
  userDate: {
    color: '#959595',
  },
  userName: {
    fontWeight: 600,
    marginRight: '0.5em',
    '& > a': {
      color: 'rgb(3, 3, 3)',
      textDecoration: 'none',
    },
  },
}))

const EventComment = ({
  commentReplyId,
  commentCreatorId,
  commentCreatorUsername,
  commentId,
  commentCreatedAt,
  commentText,
  commentEventId,
}: {
  commentReplyId: string | null
  commentCreatorId: string
  commentCreatorUsername: string
  commentId: string
  commentCreatedAt: string
  commentText: string
  commentEventId: string
}) => {
  const classes = eventCommentStyles()
  const { user, setUser } = useContext(UserContext)
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false)
  const [isDeletingCommentOpen, setIsDeletingCommentOpen] = useState<boolean>(false)
  const [isDeletingCommentOpenError, setIsDeletingCommentError] = useState<boolean>(false)
  const [tempCommentReplies, setTempCommentReplies] = useState([])

  const removeCommentAlertHandler = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      setIsDeletingCommentOpen(false)
      return setIsDeletingCommentError(false)
    }
    setIsDeletingCommentOpen(false)
    setIsDeletingCommentError(false)
  }

  const deleteCommentHandler = async ({
    creatorId,
    commentId,
    eventId,
    userId,
  }: {
    creatorId: string
    commentId: string
    eventId: string
    userId: string
  }) => {
    // Application state: Do not run this function if the user is not logged in
    if (!user.id) return
    // Set the states of the deleting comments and errors to FALSE
    setIsDeletingCommentOpen(false)
    setIsDeletingCommentError(false)
    // Set the delete comment loading state to TRUE
    setIsDeletingComment(true)
    try {
      // Remove the comment from the database
      await axios
        .post(`/api/comments/delete`, { creatorId: creatorId, commentId: commentId, eventId: eventId, userId: userId })
        .then(() => {
          // NOTE:
          // Make sure to remove the comment from the database before removing the comment from the client state.
          // This way we can display errors if there is an error removing the user's comment
          //
          // Check and remove the comment that needs to be deleted from event data in the parent component
          // props.onEventCommentReplyDelete(commentId)
          // We need to double check if the user posted any new comments that needs to be deleted from the temporary state of comments
          if (tempCommentReplies.length) {
            const findCommentEventTempComment = tempCommentReplies.filter((comment: any) => {
              return comment._id != commentId
            })
            // Set the new state for the temporary comments
            setTempCommentReplies(findCommentEventTempComment)
          }
        })
        .then(() => {
          // Finally, set the delete comment loading state to FALSE to re-enable the disbaled "delete" buttons on comments
          setIsDeletingComment(false)
          // Set isDeletingCommentOpen to display the snackbar
          setIsDeletingCommentOpen(true)
        })
    } catch (err) {
      setIsDeletingComment(false)
      setIsDeletingCommentError(true)
    }
  }

  return (
    <div className={commentReplyId ? classes.commentReplyContainer : classes.commentContainer}>
      <div className={classes.nameDate}>
        <p className={classes.userName}>
          <Link to={`/profiles/${commentCreatorId}`}>{commentCreatorUsername}</Link>
        </p>
        <p className={classes.userDate}>{commentCreatedAt ? commentCreatedAt.split('T')[0] : 'some time ago...'}</p>
      </div>
      <p className={classes.userComment}>{commentText}</p>
      <div>
        <Button
          className={classes.commentDeleteBtn}
          onClick={() =>
            deleteCommentHandler({
              creatorId: commentCreatorId,
              commentId: commentId,
              eventId: commentEventId,
              userId: commentCreatorId,
            })
          }
          disabled={isDeletingComment}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
export default EventComment
