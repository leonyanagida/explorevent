import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dropbox } from 'dropbox'
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../../context/UserContext'
import axios from 'axios'
import dotenv from 'dotenv'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Container from '@material-ui/core/Container'
import DateRangeIcon from '@material-ui/icons/DateRange'
import EventAvailableRoundedIcon from '@material-ui/icons/EventAvailableRounded'
import ShareIcon from '@material-ui/icons/Share'
import Skeleton from '@material-ui/lab/Skeleton'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import Spacer from '../../components/Spacer'
import AboutEvent from './AboutEvent'
import AlertDeleteEventDialog from '../../components/AlertDeleteEventDialog'
import CustomSnackBar from '../../components/CustomSnackbar'
import EditEventPopper from '../../components/EditEventPopper'
import EventCommentReply from './EventCommentReply'
import EventInputComment from './EventInputComment'
import EventInputCommentReply from './EventInputCommentReply'
import eventCardGrayImg from '../../assets/img/eventcardgray.jpg'

dotenv.config()
const DROPBOX_KEY = process.env.REACT_APP_CLIENT_DROPBOX_KEY

const eventStyles = makeStyles((theme) => ({
  aboutComments: {
    display: 'flex',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      marginTop: '1.5em',
    },
  },
  attendBtn: {
    backgroundColor: '#05a402',
    color: 'white',
    marginRight: '1em',
    marginTop: '0.09em',
    '&:hover': {
      color: 'white',
      backgroundColor: '#09bb06',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8em',
      marginRight: '0.5em',
    },
  },
  unAttendBtn: {
    backgroundColor: '#d0d0d0',
    color: 'black',
    marginRight: '1em',
    marginTop: '0.09em',
    '&:hover': {
      backgroundColor: '#909090',
    },
  },
  aboutTab: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  bar: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column-reverse',
      visibility: 'none',
    },
  },
  btnIcon: {
    marginRight: '0.4rem',
  },
  btnsContainer: {
    display: 'flex',
    maxHeight: '2.5em',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'auto',
    },
  },
  commentItemContainer: {
    marginLeft: 0,
  },
  commentItemLi: {
    listStyle: 'none',
  },
  commentItemUl: {
    listStyle: 'none',
  },
  commentsTab: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  defaultTab: {
    marginRight: '2em', // Default tab and underline tab must have a margin-right
    textDecoration: 'none',
  },
  deleteEventBtn: {
    marginLeft: '1em',
  },
  eventCommentSnackbar: {
    maxWidth: 300,
    margin: 'auto',
  },
  eventImgContainer: {
    background: 'inherit',
    borderRadius: '5px',
    boxShadow: '0 0 1rem 0 rgba(0, 0, 0, .2)',
    height: '20rem',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    zIndex: 1,
    '&::before': {
      content: `''`,
      position: 'absolute',
      background: 'inherit',
      zIndex: '-1',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow: 'inset 0 0 2000px rgb(0 0 0 / 76%)',
      filter: 'blur(10px)',
      margin: '-20px',
    },
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      maxHeight: '20rem',
    },
  },
  eventInputCommentReplyContainer: {
    marginTop: '-1em',
  },
  eventLikes: {
    marginTop: 0,
    paddingRight: '0.5em',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
  eventName: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25em',
    },
  },
  eventStats: {
    color: 'rgb(96, 96, 96)',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column',
      visibility: 'none',
    },
  },
  eventUsersAttending: {
    marginTop: 0,
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  fbBtn: {
    marginRight: '0.3em',
  },
  img: {
    height: '100%',
    maxHeight: '25em',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  likeEvent: {
    color: '#065fd4',
    marginRight: '1em',
    marginTop: '0.09em',
  },
  unlikeEvent: {
    color: 'gray',
    marginRight: '1em',
    marginTop: '0.09em',
  },
  nestedCommentsContainer: {
    marginBottom: '1em',
  },
  underlineTab: {
    borderBottom: '0.25rem solid #8541CA',
    marginRight: '2em', // Default tab and underline tab must have a margin-right
  },
  viewEventIndexContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '3em',
    },
  },
}))

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

interface MatchParams {
  eventId: string
}

const Event = () => {
  let history = useHistory()
  let location = useLocation()
  const classes = eventStyles()
  const match = useRouteMatch<MatchParams>('/events/:eventId')
  const urlEventId = match?.params.eventId
  const { user } = useContext(UserContext)
  const [currentTab, setCurrentTab] = useState<string>('About')
  const [eventData, setEventData] = useState<any>()
  const [eventDataError, setEventDataError] = useState<boolean>(false)
  const [isEventImgDownloaded, setIsEventImgDownloaded] = useState<boolean>(false)
  const [eventImg, setEventImg] = useState<string>('')
  const [eventImgError, setEventImgError] = useState<boolean>(false)
  const [isAttendingLoading, setIsAttendingLoading] = useState<boolean>(false)
  const [isAttendingError, setIsAttendingError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDeletingEvent, setIsDeletingEvent] = useState<boolean>(false)
  const [isDeletingEventError, setIsDeletingEventError] = useState<boolean>(false)
  const [isEventDeleteDialogOpen, setIsEventDeleteDialogOpen] = useState<boolean>(false)
  const [isEventLiked, setIsEventLiked] = useState<boolean>(false)
  const [isLikingEvent, setIsLikingEvent] = useState<boolean>(false)
  const [isLikingEventError, setIsLikingEventError] = useState<boolean>(false)
  // Temporarily holds any new comments the user might have posted
  const [tempNewUserComment, setTempNewUserComment] = useState<any>([])
  // Temporarily hold the user's attending state
  const [tempToggleAttendEvent, setTempToggleAttendEvent] = useState<boolean>(false)
  const [tempToggleAttendEventCount, setTempToggleAttendEventCount] = useState<number>(0)
  const [tempToggleLikeEventCount, setTempToggleLikeEventCount] = useState<number>(0)
  // For creating the event's comments
  const [eventNestedComments, setEventNestedComments] = useState<any>([])

  useEffect(() => {
    // Remove any previous errors
    setEventDataError(false)
    // Start the loading process
    setIsLoading(true)
    // Only fetch data if there is no eventData stored in state
    if (!eventData) {
      axios
        .get(`/api/events/${urlEventId}`)
        .then((res: any) => {
          // If the api returns an empty object display an error
          if (Object.keys(res.data).length === 0) {
            setIsLoading(false)
            return setEventDataError(true)
          }
          // This will determine if the "attend event" button will display "Attend Event" or "Unattend Event"
          // Check the user's attending events to confirm if it is the same as this event's id
          // NOTE: Make sure to do this before setting the eventData state to prevent any memory leaks from happening when re-rendering the dom
          res.data.event.usersAttending.includes(user.id)
            ? setTempToggleAttendEvent(true)
            : setTempToggleAttendEvent(false)
          // Same goes for the "like event" button
          res.data.event.eventLikes.includes(user.id) ? setIsEventLiked(true) : setIsEventLiked(false)
          // Set the count for the users attending array and event likes array
          setTempToggleLikeEventCount(res.data.event.eventLikes.length)
          setTempToggleAttendEventCount(res.data.event.usersAttending.length)
          // Keep the event data in the page's state
          setEventData(res.data.event)
          // End the loading process
          setIsLoading(false)
        })
        .catch(() => {
          // Make sure to end the loading process if we encounter an error
          setIsLoading(false)
          // This will be used to toggle whether or not we will show the event
          setEventDataError(true)
          // By setting eventImgError to true, we will display a default image from an image placeholder site
          setEventImgError(true)
        })
    }
  }, [])

  useEffect(() => {
    // For dropbox and updating the "attend event" button
    // Only download if the img was not downloaded yet
    if (!isEventImgDownloaded && eventData) {
      // Once the event data is set in the page's state, we can fetch the image from my dropbox account
      // Shhh... keep the token a secret!
      const accessToken = DROPBOX_KEY
      const dbx = new Dropbox({
        accessToken,
        fetch,
      })
      if (eventData && eventData.eventImg && !eventImg) {
        dbx
          .filesDownload({ path: `/${eventData.eventImg}` })
          .then((response: any) => {
            // Create a url from the <img /> element
            const newUrl = URL.createObjectURL(response.fileBlob)
            setEventImg(newUrl)
            setIsEventImgDownloaded(true)
          })
          .catch(() => {
            setEventImgError(true)
          })
      }
    }
    if (eventData) {
      // All comments that have replyIds will be put in a "replies" array to the parent comment that the user replied to.
      function nest(comments: any) {
        if (comments.length === 0) {
          return comments
        }
        return comments.reduce((nested: any, comment: any) => {
          comment.replies = comments.filter((reply: any) => reply.replyToId === comment._id)
          nest(comment.replies)
          if (comment.replyToId == null) {
            nested.push(comment)
          }
          return nested
        }, [])
      }
      // Contains all the replies of the comments
      const nestedComments = nest(eventData.eventComments)
      setEventNestedComments(nestedComments)
    }
  }, [eventData])

  const removeEventAttendErrorHandler = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return setIsAttendingError(false)
    }
    setIsAttendingError(false)
  }

  const deleteAndFilterEventComments = async (removeCommentId: string) => {
    // Only remove the removeCommentId and return the rest of the array
    const filterEventComments = await eventData.eventComments.filter((comment: any) => {
      return comment._id !== removeCommentId
    })
    if (tempNewUserComment.length > 0) {
      const filterTempEventComments = tempNewUserComment.filter((comment: any) => {
        return comment.comment._id !== removeCommentId
      })
      // Don't forget to also update the temporary comment state for the page
      setTempNewUserComment(filterTempEventComments)
    }
    // Set the event data once we have filtered through and removed the comment
    setEventData({ ...eventData, eventComments: filterEventComments })
  }

  const CommentItem = ({ comment, replyingToUser }: { comment: any; replyingToUser?: string | null | undefined }) => {
    return (
      <div className={classes.commentItemUl}>
        {comment
          .slice(0)
          .reverse()
          .map((item: any) => {
            return (
              <div key={item._id} className={classes.commentItemLi}>
                <EventCommentReply
                  commentReplyId={item.replyToId}
                  commentReplyIdUser={replyingToUser ? replyingToUser : ''}
                  commentCreatorId={item.creatorId._id}
                  commentCreatorUsername={item.creatorId.username}
                  commentId={item._id}
                  commentCreatedAt={item.createdAt || ''}
                  commentText={item.text}
                  commentEventId={item.eventId}
                  commentLikes={item.commentLikes}
                  onEventCommentReplyDelete={(value: any) => deleteAndFilterEventComments(value)}
                />
                <div
                  className={classes.eventInputCommentReplyContainer}
                  style={{ marginLeft: replyingToUser ? '2.5em' : 0 }}
                >
                  <EventInputCommentReply
                    eventIdValue={item.eventId}
                    replyToCommentId={item._id}
                    replyToCommentUser={item.creatorId.username}
                  />
                </div>
                {item.replies && (
                  <div>
                    <CommentItem comment={item.replies} replyingToUser={item.creatorId.username} />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    )
  }

  const eventAttendHandler = async () => {
    // Do not run this function if the user is not logged in
    if (!user.id) return
    // Set loading to true to dispay loading animation
    setIsAttendingLoading(true)
    // Remove any previous shown errors
    setIsAttendingError(false)
    await axios
      .post(`/api/events/${urlEventId}/toggleattend`, { eventId: urlEventId, userId: user.id })
      .then(() => {
        // Explanation:
        // We know that the event data is saved as eventData state on page load.
        // Since the data is set in state, we also know if the user is already attending the event or not.
        // Use common sense here. If the tempToggleAttendEvent state is set to TRUE, and the user presses the attend/unattend button,
        // it would mean that the user wants to unattend the event; subtracting 1 from the tempToggleAttendEventCount.
        // If the tempToggleAttendEventCount is false, it would mean that the user wants to attend the event, therefore adding 1 to the tempToggleAttendEventCount.
        tempToggleAttendEvent
          ? setTempToggleAttendEventCount(tempToggleAttendEventCount - 1)
          : setTempToggleAttendEventCount(tempToggleAttendEventCount + 1)
        // Read Explanation Above ^
        //-----------------------------//
        //
        setTempToggleAttendEvent(!tempToggleAttendEvent)
        // Remove any previous attend button errors
        setIsAttendingError(false)
        // Set loading to false to enable the attend button
        setIsAttendingLoading(false)
      })
      .catch((err) => {
        setIsAttendingError(true)
        setIsAttendingLoading(false)
      })
  }

  const eventDeleteHandler = async (confirm: boolean) => {
    try {
      // set the isDeletingEvent to true to display the loading state
      setIsDeletingEvent(true)
      // If confirm is false, just end the function here
      if (!confirm) {
        setIsEventDeleteDialogOpen(false)
        return setIsDeletingEvent(false)
      }
      // The user must be the creator to delete this event
      if (user.id !== eventData.creatorId._id) return
      // Remove any previous delete event errors
      setIsDeletingEventError(false)
      // Delete the event first
      await axios.post(`/api/events/delete`, { creatorId: eventData.creatorId._id, eventId: eventData._id })
      if (eventData.eventImg) {
        await axios.post(`/api/events/delete/img`, { eventImg: eventData.eventImg })
      }
      // If confirm is true, we want to delete the event
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (err) {
      setIsDeletingEvent(false)
      setIsDeletingEventError(true)
    }
  }

  const eventLikeHandler = async () => {
    if (!user.id) return
    if (isLikingEvent) return // Don't let users spam the like button without finishing the API request
    try {
      // Remove any previous errors
      setIsLikingEventError(false)
      // Display the loading animation
      setIsLikingEvent(true)
      // Call the toggle event like API
      await axios.post(`/api/events/${urlEventId}/togglelike`, { eventId: eventData._id, userId: user.id }).then(() => {
        // Explanation:
        // We know that the event data is saved as eventData state on page load.
        // Since the data is set in state, we also know if the user is already attending the event or not.
        // Use common sense here. If the tempToggleAttendEvent state is set to TRUE, and the user presses the attend/unattend button,
        // it would mean that the user wants to unattend the event; subtracting 1 from the tempToggleAttendEventCount.
        // If the tempToggleAttendEventCount is false, it would mean that the user wants to attend the event, therefore adding 1 to the tempToggleAttendEventCount.
        tempToggleLikeEventCount
          ? setTempToggleLikeEventCount(tempToggleLikeEventCount - 1)
          : setTempToggleLikeEventCount(tempToggleLikeEventCount + 1)
        // Read Explanation Above ^
        //-----------------------------//
        //
        // We are not receiving any data back, only the status code
        setIsEventLiked(!isEventLiked)
        setIsLikingEvent(false)
      })
    } catch (err) {
      setIsLikingEventError(true)
      setIsLikingEvent(false)
    }
  }

  const generateEventAttendBtn = () => {
    if (user.id && eventData) {
      // Checking if the state of the page contains the user's id (is user authenticated or not)
      const isUserAlreadyAttendingEvent = eventData.creatorId.attendingEvents.includes(eventData._id)
      return (
        <Button
          className={
            isUserAlreadyAttendingEvent && tempToggleAttendEvent
              ? classes.unAttendBtn
              : tempToggleAttendEvent
              ? classes.unAttendBtn
              : classes.attendBtn
          }
          onClick={() => eventAttendHandler()}
          variant="contained"
          disabled={isAttendingLoading}
        >
          {isUserAlreadyAttendingEvent && tempToggleAttendEvent ? (
            <EventAvailableRoundedIcon className={classes.btnIcon} />
          ) : tempToggleAttendEvent ? (
            <EventAvailableRoundedIcon className={classes.btnIcon} />
          ) : (
            <DateRangeIcon className={classes.btnIcon} />
          )}
          {isAttendingLoading
            ? 'Loading...'
            : isUserAlreadyAttendingEvent && tempToggleAttendEvent
            ? 'You are Attending'
            : tempToggleAttendEvent
            ? 'You are Attending'
            : 'Attend Event'}
        </Button>
      )
    } else {
      return (
        <Button className={classes.attendBtn} variant="contained" disabled>
          <DateRangeIcon className={classes.btnIcon} /> Attend Event
        </Button>
      )
    }
  }
  // We are making two seperate cases:
  // Case: We have event data => display the normal event design page
  // Case: Failed to fetch event data => display the error event design page
  return (
    <div className={classes.viewEventIndexContainer}>
      {(!eventData && !eventDataError) || isLoading ? (
        <Container maxWidth="md">
          <Skeleton variant="rect" width="100%" height={300} />
          <br />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
          <br />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </Container>
      ) : eventDataError ? (
        <div>
          <Container maxWidth="md">
            <div>
              <div className={classes.eventImgContainer}>
                <img className={classes.img} src={eventCardGrayImg} alt="Error finding event" />
              </div>
              <div>
                <h1>Unable to find event!</h1>
                <p>Head to the home page and search for events again</p>
              </div>
              <hr />
              <div className={classes.bar}>
                <div className={classes.aboutComments}>
                  <span className={classes.underlineTab}>
                    <p className={classes.aboutTab}>About</p>
                  </span>
                  <span className={classes.defaultTab}>
                    <p className={classes.commentsTab}>Comments</p>
                  </span>
                </div>
                <div>
                  <Button className={classes.attendBtn} variant="contained" disabled>
                    <CheckCircleOutlineIcon className={classes.btnIcon} /> Attend Event
                  </Button>
                  <Button variant="contained" disabled>
                    <ShareIcon className={classes.btnIcon} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <div>
          <Container maxWidth="md">
            {isEventDeleteDialogOpen && (
              <AlertDeleteEventDialog
                open={isEventDeleteDialogOpen}
                onConfirm={(confirm: boolean) => eventDeleteHandler(confirm)}
              />
            )}
            <div>
              <div className={classes.eventImgContainer}>
                {eventImgError && <img className={classes.img} src={eventCardGrayImg} alt="Placeholder Gray Box" />}
                {eventData.eventImg && eventImg !== '' && !eventImgError ? (
                  <img className={classes.img} src={eventImg} alt="The event" />
                ) : (
                  <img className={classes.img} src={eventCardGrayImg} alt="Placeholder Gray Box" />
                )}
              </div>
              <div>
                <h1 className={classes.eventName}>{eventData ? eventData.eventName : ''}</h1>
                <div className={classes.eventStats}>
                  <p className={classes.eventLikes}>Event likes: {tempToggleLikeEventCount} </p>
                  <p className={classes.eventUsersAttending}>People attending: {tempToggleAttendEventCount}</p>
                </div>
              </div>
              <hr />
              <div className={classes.bar}>
                <div className={classes.aboutComments}>
                  <span
                    className={currentTab === 'About' ? classes.underlineTab : classes.defaultTab}
                    onClick={() => setCurrentTab('About')}
                  >
                    <p className={classes.aboutTab}>About</p>
                  </span>
                  <span
                    className={currentTab === 'Comments' ? classes.underlineTab : classes.defaultTab}
                    onClick={() => setCurrentTab('Comments')}
                  >
                    <p className={classes.commentsTab}>Comments</p>
                  </span>
                </div>
                <div className={classes.btnsContainer}>
                  {generateEventAttendBtn()}
                  <Button
                    variant="outlined"
                    className={isEventLiked ? classes.likeEvent : classes.unlikeEvent}
                    onClick={eventLikeHandler}
                    disabled={isLikingEvent || !user.id}
                    startIcon={<ThumbUpIcon />}
                  >
                    {isEventLiked ? 'Liked' : 'Like'}
                  </Button>
                  {user.id === eventData.creatorId._id && (
                    <>
                      <EditEventPopper
                        onConfirmDelete={(confirm: boolean) => {
                          if (!confirm) {
                            return setIsDeletingEvent(false)
                          }
                          // Display the loading text for the delete button
                          setIsDeletingEvent(true)
                          // set this to true to open the delete modal confirmation
                          setIsEventDeleteDialogOpen(true)
                        }}
                        onConfirmEdit={(confirm: boolean) => {
                          if (!confirm) return // Return if confirm is false
                          history.push({
                            pathname: `/events/edit/${eventData._id}`,
                            state: { referrer: location },
                          })
                        }}
                        disabled={isDeletingEvent}
                      />
                    </>
                  )}
                </div>
              </div>
              <Spacer height={'3em'} />
              {currentTab === 'About' ? (
                <AboutEvent eventValues={eventData} /> // Passing all the event values to the AboutEvent
              ) : (
                <EventInputComment
                  eventValues={eventData}
                  onInputCommentSubmit={(value: any) =>
                    setTempNewUserComment((comment: any) =>
                      comment.concat({ comment: value.comment, username: value.username })
                    )
                  }
                />
              )}
              {currentTab === 'Comments' && tempNewUserComment.length > 0
                ? tempNewUserComment
                    .slice(0) // We are making a shallow copy of the array and reversing it
                    .reverse()
                    .map((comment: any) => {
                      return (
                        <div key={comment.comment._id + comment.comment.creatorId}>
                          <EventCommentReply
                            commentReplyIdUser={comment.username}
                            commentReplyId={comment.comment.replyToId}
                            commentCreatorId={comment.comment.creatorId}
                            commentCreatorUsername={comment.username}
                            commentId={comment.comment._id}
                            commentCreatedAt={comment.comment.createdAt || ''}
                            commentText={comment.comment.text}
                            commentEventId={comment.comment.eventId}
                            commentLikes={comment.comment.commentLikes}
                            onEventCommentReplyDelete={(value: any) => deleteAndFilterEventComments(value)}
                          />
                          <EventInputCommentReply
                            eventIdValue={comment.comment.eventId}
                            replyToCommentId={comment.comment._id}
                          />
                        </div>
                      )
                    })
                : null}
              {currentTab === 'Comments' && eventNestedComments.length > 0 && eventData.eventComments && (
                <div className={classes.commentItemContainer}>
                  <CommentItem comment={eventNestedComments} />
                </div>
              )}
              {currentTab === 'Comments' &&
                eventNestedComments.length === 0 &&
                eventData.eventComments.length === 0 &&
                tempNewUserComment.length === 0 && <p>There are no comments!</p>}
              <Spacer height={'5em'} />
            </div>
            <CustomSnackBar open={isAttendingError} autoHideDuration={6000}>
              <Alert onClose={removeEventAttendErrorHandler} severity="error" className={classes.eventCommentSnackbar}>
                Error attending event.
                <br />
                Try logging out and logging back in.
              </Alert>
            </CustomSnackBar>
            <CustomSnackBar open={isDeletingEventError} autoHideDuration={6000}>
              <Alert onClose={removeEventAttendErrorHandler} severity="error" className={classes.eventCommentSnackbar}>
                Error deleting event.
                <br />
                Try logging out and logging back in.
              </Alert>
            </CustomSnackBar>
            <CustomSnackBar open={isLikingEventError} autoHideDuration={6000}>
              <Alert onClose={removeEventAttendErrorHandler} severity="error" className={classes.eventCommentSnackbar}>
                Error liking event.
                <br />
                Try logging out and logging back in.
              </Alert>
            </CustomSnackBar>
          </Container>
        </div>
      )}
    </div>
  )
}

export default Event
