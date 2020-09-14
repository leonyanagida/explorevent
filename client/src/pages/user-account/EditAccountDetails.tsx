import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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

const EditAccountDetails = () => {
  const classes = editAccountStyles()
  const { user } = useContext(UserContext)
  const [fullName, setFullName] = useState<string>('')
  const [fullNameError, setFullNameError] = useState<boolean>(false)
  const [about, setAbout] = useState<string>('')
  const [aboutError, setAboutError] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [editAccountDetailsError, setEditAccountDetailsError] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true)
  const [isFetchingDataError, setIsFetchingDataError] = useState<boolean>(false)

  // Fetch the user's data and place data into form
  useEffect(() => {
    setIsFetchingData(true)
    // Retrieve user data
    axios
      .get(`/api/users/profile/${user.id}`)
      .then((res: any) => {
        setAbout(res.data.about)
        setUsername(res.data.username)
        setFullName(res.data.fullName)
      })
      .then(() => {
        setIsFetchingData(false)
      })
      .catch((err) => {
        setIsFetchingDataError(true)
        setIsFetchingData(false)
      })
  }, [])

  const editAccountDetailsHandler = async (event: any) => {
    event.preventDefault()
    // Prevent unauthorized users from submitting the form
    if (!user.id) return
    // Set any previous errors state to false
    setEditAccountDetailsError(false)
    // Set submitting to true to display the loading text on the button
    setIsSubmitting(true)
    try {
      // Edit account details api
      await axios
        .post('/api/users/edit/details', {
          about: about,
          fullName: fullName,
          username: username,
          userId: user.id,
        })
        .then(() => {
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
          case 'about':
            setAboutError(true)
            setIsSubmitting(false)
            break
          case 'fullName':
            setFullNameError(true)
            setIsSubmitting(false)
            break
          case 'username':
            setUsernameError(true)
            setIsSubmitting(false)
            break
          default:
            setIsSubmitting(false)
            setEditAccountDetailsError(true)
            break
        }
      } else {
        // If we get to this point, must be some other sign up error with the server
        setEditAccountDetailsError(true)
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
          <Skeleton variant="rect" width="100%" height={200} />
          <Skeleton variant="text" width="100%" />
        </div>
      ) : (
        <>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Account Details
            </Typography>
            <form className={classes.form} onSubmit={(event: any) => editAccountDetailsHandler(event)}>
              <Grid container spacing={2}>
                {editAccountDetailsError && (
                  <Grid item xs={12}>
                    <Alert severity="error">Seems like our sign up system is down!</Alert>
                  </Grid>
                )}
                {usernameError && (
                  <Grid item xs={12}>
                    <Alert severity="error">Username is already taken!</Alert>
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
                <Grid item xs={12}>
                  <TextField
                    defaultValue={fullName}
                    autoComplete="name"
                    name="fullname"
                    variant="outlined"
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    autoFocus
                    required
                    onChange={(event: any) => {
                      fullNameError && setFullNameError(false)
                      setFullName(event.target.value.trim())
                    }}
                    error={fullNameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    defaultValue={username}
                    name="username"
                    variant="outlined"
                    fullWidth
                    id="username"
                    label="Username"
                    required
                    onChange={(event: any) => {
                      usernameError && setUsernameError(false)
                      setUsername(event.target.value.trim())
                    }}
                    error={usernameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    defaultValue={about}
                    variant="outlined"
                    fullWidth
                    id="about"
                    label="About"
                    name="about"
                    rows={6}
                    multiline
                    onChange={(event: any) => {
                      aboutError && setAboutError(false)
                      setAbout(event.target.value.trim())
                    }}
                    error={aboutError}
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

export default EditAccountDetails
