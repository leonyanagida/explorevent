import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { Dropbox } from 'dropbox'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import dotenv from 'dotenv'
import Alert from '@material-ui/lab/Alert'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import EditEventAddress from './EditEventAddress'
import EditEventImg from './EditEventImg'
import EditReviewEvent from './EditReviewEvent'

dotenv.config()
const DROPBOX_KEY = process.env.REACT_APP_CLIENT_DROPBOX_KEY

const useStylesStep = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: '5em',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  createEventButton: {
    backgroundColor: '#6728a6',
    color: 'white',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}))

interface MatchParams {
  eventId: string
}

const EditEvent = () => {
  const classes = useStylesStep()
  const match = useRouteMatch<MatchParams>('/events/edit/:eventId')
  const urlEventId = match?.params.eventId
  const { user } = useContext(UserContext)
  const [eventData, setEventData] = useState<any>()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [createEventName, setCreateEventName] = useState<string>('')
  const [createEventStartDate, setCreateEventStartDate] = useState<number>(0) // Date will be a number
  const [createEventEndDate, setCreateEventEndDate] = useState<number>(0) // Date will be a number
  const [createEventStartTime, setCreateEventStartTime] = useState<number>() // Time will be a number
  const [createEventEndTime, setCreateEventEndTime] = useState<number>() // Time will be a number
  const [createEventDescription, setCreateEventDescription] = useState<string>('')
  const [createEventImg, setCreateEventImg] = useState<any>([])
  const [createEventTempDownloadImg, setCreateEventTempDownloadImg] = useState<string>('')
  const [createEventStreetAddress, setCreateEventStreetAddress] = useState<string>('')
  const [createEventCity, setCreateEventCity] = useState<string>('')
  const [createEventState, setCreateEventState] = useState<string>('')
  const [createEventZip, setCreateEventZip] = useState<string>('')
  const [createEventOnline, setCreateEventOnline] = useState<boolean>(false)
  const [createEventError, setCreateEventError] = useState<boolean>(false)
  const [createEventPublishError, setCreateEventPublishError] = useState<boolean>(false)
  const [createEventEventLink, setCreateEventEventLink] = useState<string>('')
  const [isModeratingImg, setIsModeratingImg] = useState<boolean>(false)
  const [isCreateEventPublishing, setIsCreateEventPublishing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingError, setIsLoadingError] = useState<boolean>(false)

  useEffect(() => {
    if (!eventData) {
      // Display the loading animation
      setIsLoading(true)
      // Retrieve event data
      axios
        .get(`/api/events/${urlEventId}`)
        .then((res: any) => {
          setEventData(res.data.event)
        })
        .catch(() => {
          // Display the error loading content
          setIsLoadingError(true)
          // End the loading animation
          setIsLoading(false)
        })
    }
  }, [])

  useEffect(() => {
    if (eventData) {
      // Once we have the event data, we want to set each piece of data to its own state
      setCreateEventDescription(eventData.text)
      setCreateEventStartDate(eventData.eventStartDate)
      setCreateEventEndDate(eventData.eventEndDate)
      setCreateEventName(eventData.eventName)
      setCreateEventStartTime(eventData.eventStartTime)
      setCreateEventEndTime(eventData.eventEndTime)
      setCreateEventStreetAddress(eventData.eventAddress)
      setCreateEventCity(eventData.eventCity)
      setCreateEventState(eventData.eventState)
      setCreateEventZip(eventData.eventZip)
      setCreateEventOnline(eventData.online)
      // Dropbox API
      const accessToken = DROPBOX_KEY
      const dbx = new Dropbox({
        accessToken,
        fetch,
      })
      // Run if the user uploaded an event image
      if (eventData.eventImg) {
        dbx
          .filesDownload({ path: `/${eventData.eventImg}` })
          .then((response: any) => {
            const newUrl = URL.createObjectURL(response.fileBlob)
            var file = new File(['content'], `${newUrl}`, {
              type: 'image',
            })
            const createPreview = Object.assign(file, {
              preview: URL.createObjectURL(file),
              path: response.name,
            })
            // Once we set all pieces of the event data to its own state,
            setCreateEventImg([createPreview])
            setCreateEventTempDownloadImg(newUrl)
            // then set loading to false to display the "edit event" page
            setIsLoading(false)
          })
          .catch(() => {
            setIsLoading(false)
          })
      } else {
        const file = new File(['content'], '', {
          type: 'image',
        })
        const eventImgFile = Object.assign(file, {
          preview: '',
          path: '',
        })
        // Once we set all pieces of the event data to its own state,
        setCreateEventImg([eventImgFile])
        // Set loading to false to display the "edit event" page
        setIsLoading(false)
      }
    }
  }, [eventData])

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      createEventImg.forEach((file: any) => URL.revokeObjectURL(file.preview))
    },
    [createEventImg]
  )

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const publishEventHandler = async () => {
    // Remove any previous errors
    setCreateEventPublishError(false)
    // Set is publishing to display the loading animation
    setIsCreateEventPublishing(true)
    // Map through the array of images (Should be only one image for the event)
    const imgPreview = createEventImg.map((file: any) => {
      return file
    })
    // First, send a post request to EDIT the event
    // NOTE:
    // If the createEventOnline state is set to true, send an empty string for the address, city, state and zip.
    // Also, we want to keep the address state just in case the user clicks the checkbox multiple times after inputting address info.
    await axios
      .post(`/api/events/${urlEventId}/edit`, {
        creatorId: eventData.creatorId._id,
        eventName: createEventName,
        eventId: eventData._id,
        eventAddress: createEventOnline ? '' : createEventStreetAddress,
        eventCity: createEventOnline ? '' : createEventCity,
        eventState: createEventOnline ? '' : createEventState,
        eventZip: createEventOnline ? '' : createEventZip,
        eventStartDate: createEventStartDate,
        eventEndDate: createEventEndDate,
        eventStartTime: createEventStartTime,
        eventEndTime: createEventEndTime,
        online: createEventOnline,
        text: createEventDescription,
      })
      .then((res: any) => {
        // Only do this if the user has added an image to the event
        if (imgPreview.length > 0) {
          // We are going to attach a "file"(image) to the form data
          let formData = new FormData()
          // Append the image, eventId, eventId, and eventImg <== Look at the backend code - routes: events
          formData.append('file', imgPreview[0])
          formData.append('eventId', res.data.event._id)
          formData.append('eventImg', imgPreview[0].path.trim())
          // Second, make a seperate post request to add the image to the event the user just created
          axios.post('/api/events/upload', formData).catch(() => {
            setCreateEventPublishError(true)
          })
        } else {
          // Since the img preview length is 0, we can send an empty string as the upload data
          axios.post('/api/events/upload/delete', { eventId: res.data.event._id }).catch(() => {
            setCreateEventPublishError(true)
          })
        }
        setIsCreateEventPublishing(false)
        // Finally, set the event link so the user can redirected on the event that was just created
        setCreateEventEventLink(res.data.event._id)
      })
      // Move on to the final page with the link of the new event
      .then(() => handleNext())
      .catch(() => {
        setCreateEventPublishError(true)
        setIsCreateEventPublishing(false)
      })
  }

  const steps = ['Add Event Details', 'Upload Event Image', 'Finalize Your Event']
  const getStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <EditEventAddress
            eventValues={{
              createEventImg,
              createEventDescription,
              createEventStartDate,
              createEventEndDate,
              createEventName,
              createEventStartTime,
              createEventEndTime,
              createEventStreetAddress,
              createEventCity,
              createEventState,
              createEventZip,
              createEventOnline,
            }}
            onCreateEventNameChange={(value: any) => setCreateEventName(value)}
            onCreateEventDescriptionChange={(value: any) => setCreateEventDescription(value)}
            onCreateEventStartDateChange={(value: any) => setCreateEventStartDate(value)}
            onCreateEventEndDateChange={(value: any) => setCreateEventEndDate(value)}
            onCreateEventStartTimeChange={(value: any) => setCreateEventStartTime(value)}
            onCreateEventEndTimeChange={(value: any) => setCreateEventEndTime(value)}
            onCreateEventStreetAddressChange={(value: any) => setCreateEventStreetAddress(value)}
            onCreateEventCityChange={(value: any) => setCreateEventCity(value)}
            onCreateEventStateChange={(value: any) => setCreateEventState(value)}
            onCreateEventZipChange={(value: any) => setCreateEventZip(value)}
            onCreateEventOnlineChange={(value: any) => setCreateEventOnline(value)}
            onCreateEventImgChange={(value: any) => setCreateEventImg(value)}
          />
        )
      case 1:
        return (
          <EditEventImg
            eventValues={{ createEventImg, createEventTempDownloadImg, isModeratingImg }}
            onCreateEventImgChange={(value: any) => {
              setCreateEventImg(value)
            }}
            onCreateEventDownloadImgChange={(value: any) => {
              setCreateEventTempDownloadImg(value)
            }}
            onIsModeratingImgChange={(value: boolean) => setIsModeratingImg(value)}
          />
        )
      case 2:
        return (
          <EditReviewEvent
            eventValues={{
              createEventName,
              createEventDescription,
              createEventStartDate,
              createEventEndDate,
              createEventStartTime,
              createEventEndTime,
              createEventImg,
              createEventStreetAddress,
              createEventCity,
              createEventState,
              createEventZip,
              createEventOnline,
              createEventTempDownloadImg,
            }}
          />
        )
      default:
        setCreateEventError(true)
        break
    }
  }
  // Note:
  // You might notice two buttons when checkcing for the isModeratingImg state
  // We need to created two different ternary operation in order for the disabled button to properly show
  // when isModeratingImg state is being passed from the child component(EventImg.tsx) to the parent component (CreatEvent.tsx)
  return (
    <React.Fragment>
      {!user.id ? (
        <Container maxWidth="sm">
          <p>Uh-oh you must be the original creator in order to edit this event</p>
        </Container>
      ) : isLoadingError ? (
        <div>
          <Container maxWidth="sm">
            <Paper className={classes.paper}>
              <br />
              <Alert severity="error">
                We are experiencing technical with events.
                <br />
                Please try again later!
              </Alert>
              <br />
            </Paper>
          </Container>
        </div>
      ) : (
        <div className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Edit Event
            </Typography>
            <br />
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    {isCreateEventPublishing ? <h1>Publishing event...</h1> : <p>Your event has been updated!</p>}
                  </Typography>
                  <Typography variant="subtitle1">
                    {createEventEventLink && (
                      <p>
                        Click the link to view your event: <a href={`/events/${createEventEventLink}`}>Your Event!</a>
                      </p>
                    )}
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {isLoading ? (
                    <div>
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="100%" />
                      <br />
                      <Skeleton variant="rect" width="100%" height={300} />
                    </div>
                  ) : (
                    getStepContent(activeStep)
                  )}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} variant="outlined" className={classes.backButton}>
                        Back
                      </Button>
                    )}
                    {isModeratingImg ? (
                      <Button variant="contained" className={classes.createEventButton} disabled>
                        Next
                      </Button>
                    ) : null}
                    {!isModeratingImg ? (
                      <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? () => publishEventHandler() : () => handleNext()}
                        className={classes.createEventButton}
                        disabled={
                          isCreateEventPublishing ||
                          !createEventName ||
                          !createEventStartDate ||
                          !createEventEndDate ||
                          !createEventDescription
                        }
                      >
                        {activeStep === steps.length - 1 ? 'Publish' : 'Next'}
                      </Button>
                    ) : null}
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
            {createEventError && (
              <>
                <br />
                <Alert severity="error">We are experiencing technical errors updating events!</Alert>
                <br />
              </>
            )}
            {createEventPublishError ? (
              <>
                <br />
                <Alert severity="error">
                  We are experiencing technical errors uploading events.
                  <br />
                  Please refresh the page!
                </Alert>
                <br />
              </>
            ) : null}
          </Paper>
        </div>
      )}
    </React.Fragment>
  )
}

export default EditEvent
