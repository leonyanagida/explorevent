import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

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

const EditAccountPassword = () => {
  const classes = editAccountStyles()
  const { user } = useContext(UserContext)
  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [password2Error, setPassword2Error] = useState<boolean>(false)
  const [editAccountPasswordError, setEditAccountPasswordError] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const editAccountPasswordHandler = async (event: any) => {
    event.preventDefault()
    // Prevent unauthorized users from submitting the form
    if (!user.id) return
    // Set any previous errors state to false
    setEditAccountPasswordError(false)
    // If the current user's email and the user's input email are the same, do not submit the form
    if (password !== password2) {
      return setPassword2Error(true)
    }
    // Set submitting to true to display the loading text on the button
    setIsSubmitting(true)
    try {
      // Edit account details api
      await axios
        .post('/api/users/edit/password', {
          password: password,
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
          case 'password':
            setPasswordError(true)
            setIsSubmitting(false)
            break
          default:
            setIsSubmitting(false)
            setEditAccountPasswordError(true)
            break
        }
      } else {
        // If we get to this point, must be some other sign up error with the server
        setEditAccountPasswordError(true)
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Edit Account Password
        </Typography>
        <form className={classes.form} onSubmit={(event: any) => editAccountPasswordHandler(event)}>
          <Grid container spacing={2}>
            {editAccountPasswordError && (
              <Grid item xs={12}>
                <Alert severity="error">Seems like our edit password system is down</Alert>
              </Grid>
            )}
            {passwordError && (
              <Grid item xs={12}>
                <Alert severity="error">Your password needs to be more secure</Alert>
              </Grid>
            )}
            {password2Error && (
              <Grid item xs={12}>
                <Alert severity="error">Passwords must match</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                defaultValue={password}
                autoComplete="password"
                name="password"
                variant="outlined"
                fullWidth
                id="password"
                label="New password"
                type="password"
                autoFocus
                required
                onChange={(event: any) => {
                  passwordError && setPasswordError(false)
                  setPassword(event.target.value)
                }}
                error={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                defaultValue={password2}
                name="password2"
                variant="outlined"
                fullWidth
                id="password2"
                label="Re-enter password"
                type="password"
                required
                onChange={(event: any) => {
                  password2Error && setPassword2Error(false)
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
            {isSubmitting ? 'Making Changes...' : 'Make Changes'}
          </Button>
          <Grid container justify="flex-start">
            <Grid item>
              <Link to="/account">Go Back</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default EditAccountPassword
