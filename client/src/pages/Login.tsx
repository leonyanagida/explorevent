import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#8541CA',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: '#8541CA',
    color: 'white',
    margin: theme.spacing(3, 0, 2),
  },
}))

const Login = () => {
  const classes = useStyles()
  const { user, setUser } = useContext(UserContext)
  const [loginErr, setLoginErr] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  const loginHandler = async (event: any) => {
    event.preventDefault() // Prevent the page from refreshing
    try {
      // Don't call the api if the email or password field is empty
      if (!email || !password) return
      setLoginErr(false) // Remove any previous login errors
      setIsLoggingIn(true) // Loading animation
      // Login api
      await axios.post('/api/users/login', { email: email, password: password }).then((res: any) => {
        // Set the auth user if we are returned with the user's id
        if (res.data) {
          // Add a bit of a buffer to display the loading animation
          setTimeout(() => {
            setIsLoggingIn(false)
            setUser(res.data)
          }, 1500)
        } else {
          setIsLoggingIn(false)
          setUser({})
        }
      })
    } catch (err) {
      // Display errors
      setLoginErr(true)
      // End the loading animation
      setIsLoggingIn(false)
      // Clear the application's user state
      setUser({})
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<{ value: string }>) => {
    loginErr && setLoginErr(false) // Clearing any previous errors
    return setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<{ value: string }>) => {
    loginErr && setLoginErr(false) // Clearing any previous errors
    return setPassword(event.target.value)
  }

  // NOTE: Automatically redirect the user if they are already logged in
  return (
    <Container component="main" maxWidth="xs">
      {user && user.id && <Redirect to="/" />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} onSubmit={loginHandler} noValidate>
          {loginErr && <Alert severity="error">Wrong email or password!</Alert>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleEmailChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
          />
          <Button type="submit" fullWidth variant="contained" className={classes.submit} disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default Login
