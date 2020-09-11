import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Alert from '@material-ui/lab/Alert'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import EventAddress from './EventAddress'
import EventImg from './EventImg'
import ReviewEvent from './ReviewEvent'

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

const CreateEvent = () => {
  const classes = useStylesStep()
  const { user } = useContext(UserContext)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [createEventName, setCreateEventName] = useState<string>('')
  const [createEventStartDate, setCreateEventStartDate] = useState<number>(0) // Date will be a number
  const [createEventEndDate, setCreateEventEndDate] = useState<number>(0) // Date will be a number
  const [createEventStartTime, setCreateEventStartTime] = useState<number | null | undefined>() // Time will be a number
  const [createEventEndTime, setCreateEventEndTime] = useState<number | null | undefined>() // Time will be a number
  const [createEventDescription, setCreateEventDescription] = useState<string>('')
  const [createEventImg, setCreateEventImg] = useState<[]>([])
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

  // This is to properly format the images so we can preview it
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
    // First, send a post request to CREATE the event
    // NOTE:
    // If the createEventOnline state is set to true, send an empty string for the address, city, state and zip.
    // Also, we want to keep the address state just in case the user clicks the checkbox multiple times after inputting address info.
    await axios
      .post('/api/events/new', {
        eventAddress: createEventOnline ? '' : createEventStreetAddress,
        eventCity: createEventOnline ? '' : createEventCity,
        eventState: createEventOnline ? '' : createEventState,
        eventZip: createEventOnline ? '' : createEventZip,
        eventStartDate: createEventStartDate,
        eventEndDate: createEventEndDate,
        eventStartTime: createEventStartTime,
        eventEndTime: createEventEndTime,
        online: createEventOnline,
        creatorId: user.id,
        eventName: createEventName,
        text: createEventDescription,
      })
      .then((res: any) => {
        console.log('this is the res data,', res.data)
        console.log('this is the mig review', imgPreview)
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
          <EventAddress
            eventValues={{
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
          />
        )
      case 1:
        return (
          <EventImg
            eventValues={{ createEventImg, isModeratingImg }}
            onCreateEventImgChange={(value: any) => setCreateEventImg(value)}
            onIsModeratingImgChange={(value: boolean) => setIsModeratingImg(value)}
          />
        )
      case 2:
        return (
          <ReviewEvent
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
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create Event
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
                  {isCreateEventPublishing ? <h1>Publishing event...</h1> : <p>Your event has been published!</p>}
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
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} variant="outlined" className={classes.backButton}>
                      Back
                    </Button>
                  )}
                  {isModeratingImg && (
                    <Button variant="contained" className={classes.createEventButton} disabled>
                      Next
                    </Button>
                  )}
                  {!isModeratingImg && (
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
                  )}
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
    </React.Fragment>
  )
}

export default CreateEvent
