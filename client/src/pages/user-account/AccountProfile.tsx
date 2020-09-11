import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Pagination from '@material-ui/lab/Pagination'
import Typography from '@material-ui/core/Typography'

const accountProfileStyles = makeStyles((theme) => ({
  accountProfile: {
    color: 'black',
  },
  accountProfileContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '3em',
    },
  },
  createdEventsTitle: {
    color: '#1e1e1e',
    marginBlockEnd: '0.2em',
  },
  eventLink: {
    color: 'black',
    textDecoration: 'none',
  },
  inline: {
    display: 'inline',
  },
  inlineEventName: {
    display: 'inline',
    '&&': {
      fontWeight: '500',
    },
  },
  listItem: {
    paddingLeft: '2px',
  },
  paginationContainer: {
    marginTop: '2em',
  },
  root: {
    width: '100%',
    maxWidth: '100%',
  },
  userAbout: {
    marginBottom: '3em',
    marginTop: '3em',
  },
  userNotFound: {
    height: '100vh',
    textAlign: 'center',
  },
}))

interface MatchParams {
  userId: string
}

const AccountProfile = () => {
  const match = useRouteMatch<MatchParams>('/profiles/:userId')
  const urlUserId = match?.params.userId
  const classes = accountProfileStyles()
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true)
  const [profileData, setProfileData] = useState<any>()
  const [profileDataError, setProfileDataError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [postsPerPage] = useState<number>(5)
  const [currentPosts, setCurrentPosts] = useState<[]>([])

  useEffect(() => {
    setIsLoading(true)
    setIsFetchingData(true)
    // Retrieve data about the user
    axios
      .get(`/api/users/profile/public/${urlUserId}`)
      .then((res: any) => {
        setProfileData(res.data)
      })
      .then(() => {
        setIsFetchingData(false)
      })
      .catch(() => {
        setProfileDataError(true)
        setIsFetchingData(false)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (profileData) {
      // We are doing calculations for pagination:
      const indexOfLastPost = page * postsPerPage
      const indexOfFirstPost = indexOfLastPost - postsPerPage
      const currPost = profileData.createdEvents.slice(indexOfFirstPost, indexOfLastPost)
      // Finally display only the current page of content
      setCurrentPosts(currPost)
    }
  }, [profileData, page])

  useEffect(() => {
    if (!isFetchingData) {
      // Make sure that we have fetched the profile data first.
      // Once the pagination for the event data is set, then we will set loading to false.
      setIsLoading(false)
    }
  }, [isFetchingData])

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const CreatedEvents = ({ events }: { events: any }) => {
    return events.map((event: any) => {
      return (
        <div key={event._id}>
          <ListItem alignItems="flex-start" className={classes.listItem}>
            <Link className={classes.eventLink} to={`/events/${event._id}`}>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body1"
                      className={classes.inlineEventName}
                      color="textPrimary"
                    >
                      {event.eventName.length > 100 ? event.eventName.slice(0, 100).concat('...') : event.eventName}
                    </Typography>
                  </React.Fragment>
                }
              />
              <div>
                {event.text.length > 100
                  ? ReactHtmlParser(event.text.slice(0, 100).concat('...'))
                  : ReactHtmlParser(event.text)}
              </div>
              <ListItemText secondary={`Created: ${moment(event.createdAt).format('MMM-DD-YYYY')}`} />
            </Link>
          </ListItem>
          <Divider />
        </div>
      )
    })
  }

  return (
    <Container maxWidth="md" className={classes.accountProfileContainer}>
      {isLoading ? (
        <p>Loading profile</p>
      ) : profileDataError || !profileData ? (
        <div className={classes.userNotFound}>
          <br />
          <br />
          <ErrorOutlineRoundedIcon fontSize="large" />
          <br />
          <h2>User was not found!</h2>
          <br />
          <Button variant="contained" color="primary" component={Link} to="/">
            Back Home
          </Button>
        </div>
      ) : (
        <div>
          <div className={classes.userAbout}>
            <h2>{profileData.username}</h2>
            <h5>{profileData.fullName}</h5>
            <p>About: {profileData.about ? profileData.about : <i>None</i>}</p>
          </div>
          <div>
            <hr />
            <br />
            <h4 className={classes.createdEventsTitle}>Created Events: </h4>
            {profileData.createdEvents.length > 0 && currentPosts ? (
              <>
                <List className={classes.root}>
                  <CreatedEvents events={currentPosts} />
                </List>
                <div className={classes.paginationContainer}>
                  <Pagination
                    count={
                      profileData.createdEvents.length < postsPerPage
                        ? 1
                        : Math.ceil(profileData.createdEvents.length / postsPerPage)
                    }
                    color="primary"
                    page={page}
                    onChange={handleChange}
                    shape="rounded"
                  />
                </div>
              </>
            ) : (
              <p>User has not created any events!</p>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}
export default AccountProfile
