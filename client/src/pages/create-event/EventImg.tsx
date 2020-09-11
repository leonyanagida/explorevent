import React, { createRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDropzone } from 'react-dropzone'
import * as tf from '@tensorflow/tfjs'
import * as nsfwjs from 'nsfwjs'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
tf.enableProdMode()

const useStylesImg = makeStyles(() => ({
  asideImg: {
    textAlign: 'center',
  },
  dropzone: {
    border: '1px solid #cccccc',
    borderRadius: '5px',
    height: '9rem', // dropzone height must be the same as the line height in dropzoneText
    position: 'relative',
  },
  dropzoneEmpty: {
    border: 'none',
    height: '0',
    position: 'relative',
  },
  dropzoneText: {
    margin: 0,
    lineHeight: '9em', // Line height must be the same as the dropzone height in dropzone
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  img: {
    display: 'block',
    maxWidth: '100%',
    height: '100%',
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 'auto',
    height: '15em',
    padding: 4,
    boxSizing: 'border-box',
  },
  thumbInner: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'hidden',
    width: '100%',
  },
}))

// Note:
// Images are being stored in the parent component: CreateEvent.tsx
// We are NOT storing state in this component, only a temporary image state will be used to store
const EventImg = (props: any) => {
  const classes = useStylesImg()
  const droppedImgRef = createRef<HTMLImageElement>()
  const [isImgAppropriate, setIsImgAppropriate] = useState<boolean>(true)
  const [imgModerationError, setImgModerationError] = useState<boolean>(false)
  const [isLocalImgModerationProcessing, setIsLocalImgModerationProcessing] = useState<boolean>(false)
  // The temporary image state will contain the user's image and will be used to update loading animations
  const [localTempImg, setLocalTempImg] = useState<[]>([])

  useEffect(() => {
    // Once we press the next button, the local temp img is emptied
    if (localTempImg.length) {
      // Always check to see if there is an image in the array before doing any image moderation
      moderateImg()
    }
  }, [localTempImg])

  // For removing the img
  const removeImg = () => {
    // Change all the image settings back to the default states
    setLocalTempImg([])
    props.onCreateEventImgChange([])
    setIsImgAppropriate(true)
    // setImgModerationError(false)
    setIsLocalImgModerationProcessing(false)
  }

  // We want to keep images legal for users under 18 years of age
  const moderateImg = async () => {
    // NOTE:
    // Unfortunately, we cannot run any code that changes the state of the application before running nsfwjs.
    // Therefore, state changes made for this component is done while the image is being dropped (useDropzone)
    try {
      const model = await nsfwjs.load()
      const predictions = await model.classify(droppedImgRef.current!)
      predictions.map((item: any) => {
        if (item.className === 'Hentai' || item.className === 'Porn' || item.className === 'Sexy') {
          // If the algorithm detects that the image is too sensetive, we will not allow the user to upload it
          if (item.probability > 0.6) {
            // Make sure to remove the image before setting the image moderation back to false
            removeImg()
            // Change the state of setIsImgAppropriate to display an error and remove the image
            setIsImgAppropriate(false)
            // End the moderation proccess
            setIsLocalImgModerationProcessing(false)
            // Change the image on the parent component
            return props.onIsModeratingImgChange(false)
          }
        }
      })
      // Set the local img processing state back to false to remove the loading animation
      setIsLocalImgModerationProcessing(false)
      // If the image passes moderation, Return set img to okay
      props.onIsModeratingImgChange(false)
    } catch (err) {
      // Set the error to true to display an alert
      setImgModerationError(true)
      // Remove the bad image
      removeImg()
      // Set the local moderating
      setIsLocalImgModerationProcessing(false)
      // Make sure to remove the image if there is an issue moderating the img
      props.onIsModeratingImgChange(false)
    }
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: 'image/*',
    maxSize: 2097152, // Images have a 2 Megabytes size limit
    onDrop: (acceptedFiles: any) => {
      // NOTE:
      // Must run these functions in HERE and not in "useEffect" in order for our loading animations to work
      // ================================================================= //
      // Remove previous set errors
      setImgModerationError(false)
      // Call the parent component to display the loading state when the user uploads a different img
      props.onIsModeratingImgChange(true)
      // Set the this components moderation loading state to true
      setIsLocalImgModerationProcessing(true)
      // Set to true to remove previous image moderation warnings
      setIsImgAppropriate(true)
      // ================================================================= //
      // Send changes to parent compnent
      props.onCreateEventImgChange(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
      // Remember:
      // Set the img state for this component
      setLocalTempImg(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Upload Image (optional)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div
            {...getRootProps({
              className: props.eventValues.createEventImg.length ? classes.dropzoneEmpty : classes.dropzone,
            })}
          >
            <input {...getInputProps()} />
            {!props.eventValues.createEventImg.length && (
              <p className={classes.dropzoneText}>Click or drag and drop images here</p>
            )}
          </div>
          <br />
          {fileRejections.length ? (
            <Alert severity="error">Must be an image and smaller than 2MB in size!</Alert>
          ) : null}
          {!isImgAppropriate ? <Alert severity="warning">The image is not appropriate!</Alert> : null}
          {imgModerationError ? <Alert severity="error">Error uploading image, try again</Alert> : null}
          {(localTempImg.length > 0 || props.eventValues.createEventImg.length > 0) && (
            <aside className={classes.asideImg}>
              {props.eventValues.createEventImg.map((file: any) => {
                return (
                  <div className={classes.thumb} key={file.name}>
                    <div className={classes.thumbInner}>
                      <img
                        src={file.preview}
                        className={classes.img}
                        ref={droppedImgRef}
                        alt="Preview"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                )
              })}
              <br />
              {isLocalImgModerationProcessing ? (
                <div>
                  <h2>Processing Image...</h2>
                  <LinearProgress color="secondary" />
                </div>
              ) : null}
              {props.eventValues.createEventImg.length && !isLocalImgModerationProcessing && (
                <Button onClick={removeImg} color="secondary" variant="outlined">
                  Remove
                </Button>
              )}
            </aside>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default EventImg
