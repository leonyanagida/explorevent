import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import CustomSnackBar from '../../components/CustomSnackbar'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CustomTooltip from '../../components/CustomTooltip'
import DeleteCommentPopper from '../../components/DeleteCommentPopper'

const eventCommentReplyStyles = makeStyles((theme) => ({
  btnLike: {
    display: 'inline-block',
    marginTop: '0.5em',
    paddingLeft: 0,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  btnLikeContainer: {
    display: 'flex',
  },
  commentContainer: {
    marginBottom: '-1em',
  },
  commentLikesCount: {
    color: 'rgb(96, 96, 96)',
    marginBottom: 0,
    marginLeft: '0.5em',
    marginTop: '0.4em',
  },
  commentReplyAt: {
    fontStyle: 'italic',
    backgroundColor: '#d6d6d6',
    paddingLeft: '4px',
    paddingRight: '4px',
    marginRight: '5px',
  },
  commentReplyContainer: {
    paddingLeft: '2.5em',
  },
  eventCommentSnackbar: {
    maxWidth: 300,
    margin: 'auto',
  },
  nameDate: {
    display: 'flex',
    marginTop: '2em',
  },
  thumbUpOutline: {
    color: 'rgb(96, 96, 96)',
  },
  userComment: {
    marginBottom: 0,
    marginTop: 0,
  },
  userCommentDeleteBtn: {
    padding: 0,
  },
  userCommentDeleteContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.3em',
    marginTop: '0.3em',
  },
  userDate: {
    color: '#959595',
    marginBottom: '0.4em',
  },
  userName: {
    fontWeight: 600,
    marginBottom: '0.4em',
    marginRight: '0.5em',
    '& > a': {
      color: 'rgb(3, 3, 3)',
      textDecoration: 'none',
    },
  },
}))

const EventCommentReply = (props: {
  commentReplyId: string | null
  commentReplyIdUser: string | null | undefined
  commentCreatorId: string
  commentCreatorUsername: string
  commentId: string
  commentCreatedAt: string
  commentText: string
  commentEventId: string
  commentLikes: string
  onEventCommentReplyDelete: any
}) => {
  const classes = eventCommentReplyStyles()
  const { user } = useContext(UserContext)
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false)
  // const [isDeletingCommentOpen, setIsDeletingCommentOpen] = useState<boolean>(false)
  const [isDeletingCommentError, setIsDeletingCommentError] = useState<boolean>(false)
  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(false)
  const [isLikingComment, setIsLikingComment] = useState<boolean>(false)
  const [isLikingCommentError, setIsLikingCommentError] = useState<boolean>(false)
  // Store the tempoorary like count to increment
  const [tempCommentLikeCount, setTempCommentLikeCount] = useState<number>(0)

  useEffect(() => {
    if (props.commentLikes) {
      // Create a temporary state to hold all the comments, this way we can increment and decrement the
      // like / unlike count using react hooks
      setTempCommentLikeCount(props.commentLikes.length)
      // Check if the comment likes array contains the logged in user's id.
      // Setting the state of setIsCommentLiked will change the color of the liked comment to indicate
      // that this comment has been liked by user
      if (props.commentLikes.includes(user.id)) {
        setIsCommentLiked(true)
      } else {
        setIsCommentLiked(false)
      }
    }
  }, [])

  const likeCommentHandler = async ({ commentId, userId }: { commentId: string; userId: string }) => {
    if (!user.id) return // Only authorized users can like the comment
    if (isLikingComment) return // Do not let the user spam the like button before finishing the API call
    try {
      // Remove previous errors
      setIsLikingCommentError(false)
      // Set the liking comment loading state to TRUE
      setIsLikingComment(true)
      await axios.post(`/api/comments/togglelike`, { commentId: commentId, userId: userId }).then(() => {
        // PLEASE NOTE: We want to add or subtract the like count before we set the state for setIsCommentLiked
        if (!isCommentLiked) {
          setTempCommentLikeCount(tempCommentLikeCount + 1)
        } else {
          setTempCommentLikeCount(tempCommentLikeCount - 1)
        }
        setIsCommentLiked(!isCommentLiked)
        setIsLikingComment(false)
      })
    } catch (err) {
      setIsLikingComment(false)
      setIsLikingCommentError(true)
    }
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
    try {
      // Remove previous errors
      setIsDeletingCommentError(false)
      // Set the delete comment loading state to TRUE
      setIsDeletingComment(true)
      // Remove the comment from the database
      await axios
        .post(`/api/comments/delete`, {
          creatorId: creatorId,
          commentId: commentId,
          eventId: eventId,
          userId: userId,
        })
        .then(() => {
          // NOTE:
          // Make sure to remove the comment from the database before removing the comment from the client state.
          // This way we can display errors if there is an error removing the user's comment
          //
          // Check and remove the comment that needs to be deleted from event data in the parent component
          props.onEventCommentReplyDelete(commentId)
        })
    } catch (err) {
      setIsDeletingCommentError(true)
      setIsDeletingComment(false)
    }
  }

  const removeCommentAlertHandler = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      // setIsDeletingCommentOpen(false)
      return setIsDeletingCommentError(false)
    }
    // setIsDeletingCommentOpen(false)
    setIsDeletingCommentError(false)
  }

  return (
    <div className={props.commentReplyId ? classes.commentReplyContainer : classes.commentContainer}>
      <div className={classes.nameDate}>
        <p className={classes.userName}>
          <Link to={`/profiles/${props.commentCreatorId}`}>{props.commentCreatorUsername}</Link>
        </p>
        <p className={classes.userDate}>
          {props.commentCreatedAt ? props.commentCreatedAt.split('T')[0] : 'some time ago...'}
        </p>
      </div>
      <div className={classes.userCommentDeleteContainer}>
        <p className={classes.userComment}>
          {props.commentReplyId ? <span className={classes.commentReplyAt}>@{props.commentReplyIdUser} </span> : ''}{' '}
          {props.commentText}
        </p>
        {user.id === props.commentCreatorId ? (
          <div>
            <DeleteCommentPopper
              // In the DeleteCommentPopper close = true, so here we have to set is deleting comment to false
              disabled={isDeletingComment}
              onConfirm={(confirm: boolean) => {
                !confirm && setIsDeletingComment(false)
                confirm &&
                  deleteCommentHandler({
                    creatorId: props.commentCreatorId,
                    commentId: props.commentId,
                    eventId: props.commentEventId,
                    userId: user.id,
                  })
              }}
            />
          </div>
        ) : null}
      </div>
      <div className={classes.btnLikeContainer}>
        <div
          className={classes.btnLike}
          onClick={() => likeCommentHandler({ commentId: props.commentId, userId: user.id })}
        >
          {isCommentLiked ? (
            <CustomTooltip arrow title="Unlike">
              <ThumbUpIcon fontSize="small" color="primary" />
            </CustomTooltip>
          ) : (
            <CustomTooltip arrow title="Like">
              {user.id ? (
                <ThumbUpIcon fontSize="small" className={classes.thumbUpOutline} />
              ) : (
                <Link to="/signup">
                  <ThumbUpIcon fontSize="small" className={classes.thumbUpOutline} />
                </Link>
              )}
            </CustomTooltip>
          )}
        </div>
        <p className={classes.commentLikesCount}>
          {tempCommentLikeCount === 1 ? `${tempCommentLikeCount} like` : `${tempCommentLikeCount} likes`}
        </p>
      </div>
      <CustomSnackBar open={isDeletingCommentError} autoHideDuration={6000}>
        <Alert onClose={removeCommentAlertHandler} severity="error" className={classes.eventCommentSnackbar}>
          Error deleting comment.
          <br />
          Try logging out and logging back in!
        </Alert>
      </CustomSnackBar>
      <CustomSnackBar open={isLikingCommentError} autoHideDuration={6000}>
        <Alert onClose={removeCommentAlertHandler} severity="error" className={classes.eventCommentSnackbar}>
          Comment error.
          <br />
          Try logging out and logging back in!
        </Alert>
      </CustomSnackBar>
    </div>
  )
}
export default EventCommentReply
