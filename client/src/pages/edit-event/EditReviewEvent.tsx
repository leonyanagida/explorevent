import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactHtmlParser from 'react-html-parser'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStylesReview = makeStyles((theme) => ({
  gridImg: {
    textAlign: 'center',
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
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

const EditReviewEvent = (props: any) => {
  const classes = useStylesReview()

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom></Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.gridImg}>
          {props.eventValues.createEventTempDownloadImg ? (
            <div className={classes.thumb}>
              <div className={classes.thumbInner}>
                <img src={props.eventValues.createEventTempDownloadImg} className={classes.img} alt="Event Preview" />
              </div>
            </div>
          ) : (
            props.eventValues.createEventImg.length > 0 &&
            !props.eventValues.createEventImg.includes('') &&
            props.eventValues.createEventImg[0].preview !== '' &&
            props.eventValues.createEventImg.map((file: any) => {
              return (
                <div className={classes.thumb} key={file}>
                  <div className={classes.thumbInner}>
                    <img src={file.preview} className={classes.img} alt="Preview" />
                  </div>
                </div>
              )
            })
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            {props.eventValues.createEventName}
          </Typography>
          <hr />
        </Grid>
        <Grid item container direction="column" xs={12}>
          <Typography variant="subtitle2" gutterBottom className={classes.title}>
            Event Details:
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Date: {props.eventValues.createEventStartDate} - {props.eventValues.createEventEndDate} at{' '}
                {props.eventValues.createEventStartTime ? `${props.eventValues.createEventStartTime} - ` : null}{' '}
                {props.eventValues.createEventEndTime ? `${props.eventValues.createEventEndTime} ` : null}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                {props.eventValues.createEventOnline
                  ? 'This event is held online'
                  : `Location: ${props.eventValues.createEventStreetAddress} ${props.eventValues.createEventCity}, ${props.eventValues.createEventState} ${props.eventValues.createEventZip}`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div>
                <br />
                {props.eventValues.createEventDescription && ReactHtmlParser(props.eventValues.createEventDescription)}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default EditReviewEvent
