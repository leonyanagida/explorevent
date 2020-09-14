import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import EmailIcon from '@material-ui/icons/Email'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

const editAccountStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: '#8541CA',
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: '#8541CA',
    margin: theme.spacing(3, 0, 2),
  },
}))

const EditAccountEmail = () => {
  const classes = editAccountStyles()
  const { user } = useContext(UserContext)
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [email2, setEmail2] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(false)
  const [email2Error, setEmail2Error] = useState<boolean>(false)
  const [emailMatchingError, setEmailMatchingError] = useState<boolean>(false)
  const [editAccountEmailError, setEditAccountEmailError] = useState<boolean>(false)
  const [editAccountEmail2Error, setEditAccountEmail2Error] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true)
  const [isFetchingDataError, setIsFetchingDataError] = useState<boolean>(false)

  // Fetch the user's data and place data into form
  useEffect(() => {
    setIsFetchingData(true)
    // We are fetching the data to confirm we have the latest email for the user
    axios
      .get(`/api/users/email/${user.email}`)
      .then((res: any) => {
        setCurrentEmail(res.data.email)
      })
      .then(() => {
        setIsFetchingData(false)
      })
      .catch(() => {
        setIsFetchingDataError(true)
        setIsFetchingData(false)
      })
  }, [])

  const editAccountDetailsHandler = async (event: any) => {
    event.preventDefault()
    // Set any previous errors state to false
    setEditAccountEmailError(false)
    setEmailMatchingError(false)
    // Prevent unauthorized users from submitting the form
    if (!user.id) return
    // If the current user's email and the user's input email are the same, do not submit the form
    if (currentEmail === email) return
    // Two emails much match
    if (email !== email2) {
      // Return and let the user know that the two emails much match
      return setEmailMatchingError(true)
    }
    // Set submitting to true to display the loading text on the button
    setIsSubmitting(true)
    try {
      // Edit account details api
      await axios
        .post('/api/users/edit/email', {
          email: email,
          userId: user.id,
        })
        .then(() => {
          // Set a small buffer before sending the user back to the account page
          setTimeout(() => {
            window.location.href = '/account'
          }, 1500)
        })
    } catch (err) {
      // Check the error response from the server
      if (err.response.data.error) {
        // We are getting the key value from the error object
        // How the response looks: { code: 1000, name: "MongoError", keyValue: {"about": "about text"}}
        const theErr = Object.keys(err.response.data.error.keyValue)[0] // Extract the key from the keyValue object
        switch (theErr) {
          case 'email':
            setEmailError(true)
            setIsSubmitting(false)
            break
          default:
            setIsSubmitting(false)
            setEditAccountEmailError(true)
            break
        }
      } else {
        // If we get to this point, must be some other sign up error with the server
        setEditAccountEmailError(true)
        setIsSubmitting(false)
      }
    }
  }

  // Note if there is error fetching the data from the database, display an alert stating to logout and log back in.
  // Make sure to also disable the submit button if there are any errors!
  return (
    <Container component="main" maxWidth="xs">
      {isFetchingData ? (
        <div className={classes.paper}>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="rect" width="100%" height={100} />
        </div>
      ) : (
        <>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Email Address
            </Typography>
            <form className={classes.form} onSubmit={(event: any) => editAccountDetailsHandler(event)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    Your current email is: <strong>{currentEmail}</strong>
                  </Typography>
                </Grid>
                {editAccountEmailError && (
                  <Grid item xs={12}>
                    <Alert severity="error">Seems like our email updating system is down!</Alert>
                  </Grid>
                )}
                {emailError && (
                  <Grid item xs={12}>
                    <Alert severity="error">That email is already taken by another user!</Alert>
                  </Grid>
                )}
                {emailMatchingError && (
                  <Grid item xs={12}>
                    <Alert severity="warning">Both emails much match!</Alert>
                  </Grid>
                )}
                {isFetchingDataError && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      Error retrieving account details.
                      <br />
                      Try logging out and logging back in!
                    </Alert>
                  </Grid>
                )}
                {/* <Grid item xs={12}>
                  <TextField
                    defaultValue={email}
                    autoComplete="email"
                    name="Email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Current Email"
                    autoFocus
                    required
                    onChange={(event: any) => {
                      setEditAccountEmailError(false)
                      setEmailError(false)
                      setEmail(event.target.value.trim())
                    }}
                    error={emailError}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    autoComplete="email"
                    name="Email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="New Email"
                    autoFocus
                    required
                    onChange={(event: any) => {
                      // Only set to false these errors are already set to true
                      emailMatchingError && setEmailMatchingError(false)
                      editAccountEmailError && setEditAccountEmailError(false)
                      emailError && setEmailError(false)
                      // Set the state everytime new text is entered
                      setEmail(event.target.value.trim())
                    }}
                    error={emailError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email2"
                    label="Confirm New Email"
                    required
                    onChange={(event: any) => {
                      // Only set to false these errors are already set to true
                      emailMatchingError && setEmailMatchingError(false)
                      editAccountEmail2Error && setEditAccountEmail2Error(false)
                      email2Error && setEmail2Error(false)
                      // Set the state everytime new text is entered
                      setEmail2(event.target.value.trim())
                    }}
                    error={email2Error}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting || isFetchingDataError}
              >
                {isSubmitting ? 'Making Changes...' : 'Make Changes'}
              </Button>
              <Grid container justify="flex-start">
                <Grid item>
                  <Link to="/account">Go Back</Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </>
      )}
    </Container>
  )
}

export default EditAccountEmail
