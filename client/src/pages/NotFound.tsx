import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const notFoundStyles = makeStyles((theme) => ({
  fourofour: {
    fontSize: '4em',
    textAlign: 'center',
  },
  notFoundContainer: {
    height: '100vh',
  },
  notFoundInnerContainer: {
    marginTop: '4em',
  },
  ohno: {
    textAlign: 'center',
  },
}))

const NotFound = () => {
  const classes = notFoundStyles()

  return (
    <div className={classes.notFoundContainer}>
      <div className={classes.notFoundInnerContainer}>
        <h1 className={classes.ohno}>Oh no!</h1>
        <h1 className={classes.fourofour}>404 Not Found</h1>
      </div>
    </div>
  )
}

export default NotFound
