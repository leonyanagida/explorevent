import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
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

export default function Signup() {
  let history = useHistory()
  let location = useLocation()
  const classes = useStyles()
  const { setUser } = useContext(UserContext)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [fullName, setFullName] = useState<string>('')
  const [fullNameError, setFullNameError] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(false)
  const [password1, setPassword1] = useState<string>('')
  const [password1Error, setPassword1Error] = useState<boolean>(false)
  const [password2, setPassword2] = useState<string>('')
  const [password2Error, setPassword2Error] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [signupError, setSignupError] = useState<boolean>(false)

  const signupHandler = async (event: any) => {
    event.preventDefault()
    try {
      // Remove any previous errors
      setSignupError(false)
      // Display the loading animation
      setIsSubmitting(true)
      // Make sure that the passwords match!
      if (password1 !== password2) {
        return [setPassword2Error(true), setIsSubmitting(false)]
      }
      // Sign up API
      await axios
        .post('/api/users/signup', {
          email: email,
          fullName: fullName,
          password: password1,
          username: username,
        })
        .then((res: any) => {
          if (res.data) {
            // Add a bit of deplay :)
            setTimeout(() => {
              setUser(res.data)
              history.push({
                pathname: '/',
                state: { referrer: location },
              })
            }, 1500)
          } else {
            setIsSubmitting(false)
            setSignupError(true)
          }
        })
    } catch (err) {
      // Check the error response from the server
      console.log('first', err.response.data.error)
      if (err.response.data.error) {
        // We are getting the key value from the error object
        // How the response looks: { code: 1000, name: "MongoError", keyValue: {"email": "email@email.com"}}
        let theErr: string = '' // Extract the key from the keyValue object to get the error
        // Note:
        // For the password the response looks like this:
        // {"error":{"errors":{"password":{"name":"ValidatorError","message":"Password should contain letters and numbers and be at least 6 characters long","properties":{"message":"Password should contain letters and numbers and be at least 6 characters long","type":"user defined","path":"password","value":"123"},"kind":"user defined","path":"password","value":"123"}},"_message":"User validation failed","message":"User validation failed: password: Password should contain letters and numbers and be at least 6 characters long"},"message":"Unable to sign up user"}
        if (err.response.data.error.keyValue) {
          theErr = Object.keys(err.response.data.error.keyValue)[0]
        } else if (err.response.data.error.errors.password) {
          theErr = 'password'
        } else {
          theErr = ''
        }
        // Note:
        // We are breaking after each case because we only want to display one error at a time
        // In cases where there are multiple errors, change the order of the switch statement to determine which error has priority and displays to the user
        switch (theErr) {
          case 'email':
            setEmailError(true)
            setIsSubmitting(false)
            break
          case 'username':
            setUsernameError(true)
            setIsSubmitting(false)
            break
          case 'password':
            setPassword1Error(true)
            setIsSubmitting(false)
            break
          default:
            setSignupError(true)
            setIsSubmitting(false)
            break
        }
      } else {
        // If we get to this point, must be some other sign up error with the server
        setSignupError(true)
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={(event: React.FormEvent<HTMLFormElement>) => signupHandler(event)}>
          <Grid container spacing={2}>
            {signupError && (
              <Grid item xs={12}>
                <Alert severity="error">Seems like our sign up system is down!</Alert>
              </Grid>
            )}
            {usernameError && (
              <Grid item xs={12}>
                <Alert severity="error">Username is already taken!</Alert>
              </Grid>
            )}
            {emailError && (
              <Grid item xs={12}>
                <Alert severity="error">That email is already taken!</Alert>
              </Grid>
            )}
            {password1Error && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Password should contain letters and numbers and be at least 6 characters long.
                </Alert>
              </Grid>
            )}
            {password2Error && (
              <Grid item xs={12}>
                <Alert severity="warning">Both passwords must match!</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="fullname"
                variant="outlined"
                required
                fullWidth
                id="fullname"
                label="Full Name"
                autoFocus
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  emailError && setEmailError(false)
                  fullNameError && setFullNameError(false)
                  password1Error && setPassword1Error(false)
                  password2Error && setPassword2Error(false)
                  signupError && setSignupError(false)
                  setFullName(event.target.value.trim())
                }}
                error={fullNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  emailError && setEmailError(false)
                  fullNameError && setFullNameError(false)
                  password1Error && setPassword1Error(false)
                  password2Error && setPassword2Error(false)
                  signupError && setSignupError(false)
                  setEmail(event.target.value.trim())
                }}
                error={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Create a username"
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  emailError && setEmailError(false)
                  fullNameError && setFullNameError(false)
                  password1Error && setPassword1Error(false)
                  password2Error && setPassword2Error(false)
                  signupError && setSignupError(false)
                  usernameError && setUsernameError(false)
                  setUsername(event.target.value.trim())
                }}
                error={usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="current-password"
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  emailError && setEmailError(false)
                  fullNameError && setFullNameError(false)
                  password1Error && setPassword1Error(false)
                  password2Error && setPassword2Error(false)
                  signupError && setSignupError(false)
                  setPassword1(event.target.value)
                }}
                error={password1Error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Re-enter password"
                type="password"
                id="password2"
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  emailError && setEmailError(false)
                  fullNameError && setFullNameError(false)
                  password1Error && setPassword1Error(false)
                  password2Error && setPassword2Error(false)
                  signupError && setSignupError(false)
                  setPassword2(event.target.value)
                }}
                error={password2Error}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}
