import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import dotenv from 'dotenv'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { states } from '../../misc/states'

dotenv.config()
const TINYAPI_KEY = process.env.REACT_APP_CLIENT_TINYAPI_KEY

const EditEventAddress = (props: any) => {
  const handleEditorChange = (content: any, editor: any) => {
    props.onCreateEventDescriptionChange(content)
  }

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onCreateEventOnlineChange(event.target.checked)
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Event Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="eventName"
            name="eventName"
            label="Event Name"
            fullWidth
            variant="outlined"
            onChange={(event: any) => props.onCreateEventNameChange(event.target.value)}
            defaultValue={props.eventValues.createEventName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="startDate"
            name="startDate"
            label="Start Date"
            fullWidth
            type="date"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: any) => props.onCreateEventStartDateChange(event.target.value)}
            defaultValue={props.eventValues.createEventStartDate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="startTime"
            name="startTime"
            label="Start Time"
            fullWidth
            type="time"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            onChange={(event: any) => props.onCreateEventStartTimeChange(event.target.value)}
            defaultValue={props.eventValues.createEventStartTime}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="endDate"
            name="endDate"
            label="End Date"
            fullWidth
            type="date"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: any) => props.onCreateEventEndDateChange(event.target.value)}
            defaultValue={props.eventValues.createEventEndDate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="endTime"
            name="endTime"
            label="End Time"
            fullWidth
            type="time"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            onChange={(event: any) => props.onCreateEventEndTimeChange(event.target.value)}
            defaultValue={props.eventValues.createEventEndTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.eventValues.createEventOnline}
                onChange={handleCheckBoxChange} // Calling another function because Typescript....
                name="online"
                color="primary"
              />
            }
            label="Check this box if the event is held online"
          />
        </Grid>
        {props.eventValues.createEventOnline ? null : (
          <>
            <Grid item xs={12} sm={7}>
              <TextField
                id="streetAddress"
                name="streetAddress"
                label="Street Address"
                fullWidth
                variant="outlined"
                onChange={(event: any) => props.onCreateEventStreetAddressChange(event.target.value)}
                defaultValue={props.eventValues.createEventStreetAddress}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                id="city"
                name="city"
                label="City"
                fullWidth
                variant="outlined"
                onChange={(event: any) => props.onCreateEventCityChange(event.target.value)}
                defaultValue={props.eventValues.createEventCity}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                value={props.eventValues.createEventState}
                onInputChange={(event: any, newInputValue: string | null) => {
                  props.onCreateEventStateChange(newInputValue)
                }}
                id="state"
                options={states}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.abbrev)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    variant="outlined"
                    inputProps={{ ...params.inputProps, maxLength: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                id="zipcode"
                name="zipcode"
                label="Zip Code"
                fullWidth
                variant="outlined"
                onChange={(event: any) => props.onCreateEventZipChange(event.target.value)}
                defaultValue={props.eventValues.createEventZip}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Editor
            apiKey={TINYAPI_KEY}
            initialValue={props.eventValues.createEventDescription}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help',
            }}
            onEditorChange={handleEditorChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default EditEventAddress
