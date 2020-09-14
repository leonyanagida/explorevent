import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import ReactHtmlParser from 'react-html-parser'
import moment from 'moment'
import DateRangeIcon from '@material-ui/icons/DateRange'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import PublicIcon from '@material-ui/icons/Public'
import Spacer from '../../components/Spacer'

const aboutEventStyles = makeStyles(() => ({
  eventDetails: {
    display: 'flex',
  },
  detail: {
    marginLeft: '0.8em',
    marginTop: 0,
  },
}))

const AboutEvent = (props: any) => {
  const classes = aboutEventStyles()

  return (
    <div>
      {props.eventValues ? (
        <div>
          <div>
            <h3>Event Details</h3>
            <div className={classes.eventDetails}>
              <DateRangeIcon />
              <p className={classes.detail}>
                {moment(props.eventValues.eventStartDate).format('MMM Do YYYY')} -{' '}
                {moment(props.eventValues.eventEndDate).format('MMM Do YYYY')}{' '}
                {props.eventValues.eventStartTime
                  ? `at ${props.eventValues.eventStartTime} - ${props.eventValues.eventEndTime}`
                  : ''}
              </p>
            </div>
            <div className={classes.eventDetails}>
              <PublicIcon />
              <p className={classes.detail}>Public - Hosted by {props.eventValues.creatorId.username}</p>
            </div>
            <div className={classes.eventDetails}>
              <LocationOnIcon />
              <p className={classes.detail}>
                {props.eventValues.online
                  ? 'This event  is held online'
                  : `${props.eventValues.eventAddress} ${props.eventValues.eventCity} ${props.eventValues.eventState} ${props.eventValues.eventZip}`}
              </p>
            </div>
            <div>
              <br />
              <strong>Description:</strong> {props.eventValues.text && ReactHtmlParser(props.eventValues.text)}
            </div>
          </div>
          <Spacer height={'3em'} />
          <div>
            <h3>Host</h3>
            <Link to={`/profiles/${props.eventValues.creatorId._id}`}>
              <p>{props.eventValues.creatorId.username}</p>
            </Link>
            <p>
              {props.eventValues.creatorId.about ? (
                props.eventValues.creatorId.about
              ) : (
                <i>The host does not have an about section</i>
              )}
            </p>
          </div>
          <Spacer height={'3em'} />
          <div>
            <h3>Guidelines</h3>
            <p>Please read the guidelines of hosting and attending events</p>
            <p>Guidelines</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Cookie Policy</p>
          </div>
        </div>
      ) : (
        <p>No information about this event!</p>
      )}
    </div>
  )
}

export default AboutEvent
