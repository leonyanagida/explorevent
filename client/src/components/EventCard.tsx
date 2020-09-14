import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Dropbox } from 'dropbox'
import dotenv from 'dotenv'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import eventCardGrayImg from '../assets/img/eventcardgray.jpg'

dotenv.config()
const DROPBOX_KEY = process.env.REACT_APP_CLIENT_DROPBOX_KEY

const eventCardStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f9f9f9',
    marginTop: '2em',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    visibility: 'visible',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: 'gray',
  },
  tester: {
    display: '-webkit-box',
    fontSize: '1.2rem',
    fontWeight: 500,
    letterSpacing: '-0.1px',
    lineHeight: '1.7rem',
    marginBottom: '1.5rem',
    maxHeight: '4.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    whiteSpace: 'normal',
  },
  eventCardLink: {
    color: 'black',
    textDecoration: 'none',
  },
  eventCardText: {
    marginBottom: '0.8rem',
  },
  content: {
    minHeight: '12em',
  },
}))

const EventCard = ({
  eventDate,
  eventHours,
  eventId,
  eventImg,
  eventLikesCount,
  eventName,
  eventCity,
  eventState,
  eventStartDate,
  exclusive,
  online,
  text,
  usersAttendingCount,
}: {
  eventDate: string
  eventHours: string
  eventId: string
  eventImg: string
  eventLikesCount: number
  eventName: string
  eventCity: string
  eventState: string
  eventStartDate: string
  exclusive: boolean
  online: boolean
  text: string
  usersAttendingCount: number
}) => {
  const classes = eventCardStyles()
  const [eventCardImg, setEventCardImg] = useState<string>('')
  const [eventImgError, setEventImgError] = useState<boolean>(false)
  const [isCardLoading, setIsCardLoading] = useState<boolean>(true)

  useEffect(() => {
    // Dropbox API
    const accessToken = DROPBOX_KEY
    const dbx = new Dropbox({
      accessToken,
      fetch,
    })
    // Only run if the user uploaded an image for the event
    if (eventImg) {
      dbx
        .filesDownload({ path: `/${eventImg}` })
        .then((response: any) => {
          // Create an url for the <img /> element
          const newUrl = URL.createObjectURL(response.fileBlob)
          setEventCardImg(newUrl)
          setIsCardLoading(false)
        })
        .catch(() => {
          // If this is set to true, we will display a gray placeholder image for the event
          setEventImgError(true)
          setIsCardLoading(false)
        })
    } else {
      setIsCardLoading(false)
    }
  }, [])

  return (
    <Card className={classes.root}>
      {isCardLoading ? (
        <>
          <Skeleton variant="rect" width="100%" height={300} />
          <br />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <br />
        </>
      ) : (
        <>
          <Link to={`/events/${eventId}`}>
            <CardMedia
              className={classes.media}
              image={eventCardImg && !eventImgError && !isCardLoading ? eventCardImg : eventCardGrayImg}
              title="Event"
            />
          </Link>
          <CardContent className={classes.content}>
            <Typography variant="h6" color="textPrimary" component="p" className={classes.tester}>
              <Link to={`/events/${eventId}`} className={classes.eventCardLink}>
                {eventName.length > 80 ? eventName.slice(0, 80).concat('...') : eventName}
              </Link>
            </Typography>
            <div className={classes.eventCardText}>
              {text.length > 130 ? ReactHtmlParser(text.slice(0, 130).concat('...')) : ReactHtmlParser(text)}
            </div>
            <Typography variant="body2" color="textSecondary" component="p">
              Event Date: {moment(eventStartDate).format('MMM Do YYYY')}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {online ? 'Location: Online event' : `Location: ${eventCity}, ${eventState}`}
            </Typography>
            <br />
            <Typography variant="body2" color="textSecondary" component="p">
              {`Likes: ${eventLikesCount}`}
              <br />
              {`Attending: ${usersAttendingCount}`}
            </Typography>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default EventCard
