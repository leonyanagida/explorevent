import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import Spacer from '../components/Spacer'

const logoutStyles = makeStyles((theme) => ({
  logout: {
    height: '100vh',
  },
  logoutRefresh: {
    textAlign: 'center',
  },
  logoutText: {
    textAlign: 'center',
  },
}))

const Logout = () => {
  const classes = logoutStyles()
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false)
  const [isLoggedOutError, setIsLoggedOutError] = useState<boolean>(false)

  useEffect(() => {
    // Remove the user's session on the backend
    axios
      .get('/api/users/logout')
      .then(() => {
        // Set logout to true to trigger the redirectHandler
        setIsLoggedOut(true)
      })
      .catch(() => {
        setIsLoggedOut(false)
        // We are setting the logout error to true to display an error message
        setIsLoggedOutError(true)
      })
  }, [])

  const redirectHandler = () => {
    // Redirect the user to the home page
    setTimeout(() => {
      return (window.location.href = '/')
    }, 700)
  }

  return (
    <Container maxWidth="sm">
      <div className={classes.logout}>
        <Spacer height={'5em'} />
        {!isLoggedOutError && <h3 className={classes.logoutText}>Logging out...</h3>}
        <LinearProgress color="secondary" />
        <LinearProgress color="secondary" />
        {isLoggedOut && redirectHandler()}
        {isLoggedOutError && <h3 className={classes.logoutRefresh}>Please refresh the page!</h3>}
      </div>
    </Container>
  )
}

export default Logout
