import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const deleteAccountStyles = makeStyles((theme) => ({
  back: {
    textDecoration: 'none',
    color: '#204199',
  },
  confirm: {
    textAlign: 'center',
  },
  formControlLabel: {
    marginLeft: '-13px',
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '3em',
      paddingTop: '5em',
    },
  },
}))

const DeleteAccount = () => {
  const classes = deleteAccountStyles()
  const { user } = useContext(UserContext)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)
  const [deletingAccountSuccess, setDeletingAccountSuccess] = useState<boolean>(false)
  const [deletingAccountError, setDeletingAccountError] = useState<boolean>(false)

  const handleCheckBox = () => {
    if (!user.id) return
    // Remove any previous errors when checking the box
    setDeletingAccountError(false)
    // Checkbox handler
    setIsChecked(!isChecked)
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true)
      axios.post(`/api/users/delete`, { userId: user.id }).then(() => {
        // Display the success alert for a short amount of time
        axios.get('/api/users/logout').then(() => {
          // Set logout to true to trigger the redirectHandler
          setDeletingAccountSuccess(true)
          setTimeout(() => {
            // Redirect the user back to the homepage
            window.location.href = '/'
          }, 500)
        })
      })
    } catch (err) {
      setIsDeletingAccount(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          Account Deletion
        </Typography>
        <br />
        <Typography variant="h6" align="center">
          Are you sure you want to delete your account?
        </Typography>
        <Typography variant="body2" align="center">
          This action is permanent and cannot be reversed!
        </Typography>
        <br />
        {deletingAccountError && (
          <>
            <br />
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              Unable to delete account!
              <br />
              Try logging out and logging back in.
            </Alert>
            <br />
          </>
        )}
        {deletingAccountSuccess && (
          <>
            <br />
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Your account has been deleted!
            </Alert>
            <br />
          </>
        )}
        <div className={classes.confirm}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleCheckBox}
                name="checkedB"
                color="secondary"
                disabled={isDeletingAccount}
              />
            }
            className={classes.formControlLabel}
            label="Confirm"
            labelPlacement="start"
          />
          <br />
          <br />
          <Button
            disabled={!isChecked || isDeletingAccount}
            onClick={handleDeleteAccount}
            variant="outlined"
            color="secondary"
            size="medium"
          >
            Delete Account
          </Button>
        </div>
      </Paper>
      <Link className={classes.back} to="/account">
        Go Back
      </Link>
    </Container>
  )
}

export default DeleteAccount
