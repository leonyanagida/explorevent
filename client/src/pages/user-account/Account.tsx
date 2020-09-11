import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import EmailIcon from '@material-ui/icons/Email'
import FaceIcon from '@material-ui/icons/Face'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

const accountStyles = makeStyles((theme) => ({
  accountLink: {
    textDecoration: 'none',
  },
  smallPadding: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '3.4em',
    },
  },
}))

const Account = () => {
  const classes = accountStyles()
  const { user } = useContext(UserContext)

  return (
    <Container maxWidth="md">
      <div className={classes.smallPadding}>
        <h1>My Account</h1>
        <Link className={classes.accountLink} to={`/profiles/${user.id}`}>
          <Button variant="outlined" color="primary" size="large" startIcon={<FaceIcon />}>
            View My Profile
          </Button>
        </Link>
        <br />
        <br />
        <Link className={classes.accountLink} to="/account/edit/password">
          <Button variant="outlined" color="primary" size="large" startIcon={<VpnKeyIcon />}>
            Edit Password
          </Button>
        </Link>
        <br />
        <br />
        <Link className={classes.accountLink} to="/account/edit/details">
          <Button variant="outlined" color="primary" size="large" startIcon={<AccountCircleIcon />}>
            Edit Details
          </Button>
        </Link>
        <br />
        <br />
        <Link className={classes.accountLink} to="/account/edit/email">
          <Button variant="outlined" color="primary" size="large" startIcon={<EmailIcon />}>
            Edit Email
          </Button>
        </Link>
        <br />
        <br />
        <hr />
        <br />
        <Link className={classes.accountLink} to="/account/edit/delete">
          <Button variant="outlined" color="secondary" size="large" startIcon={<DeleteIcon />}>
            Delete Account
          </Button>
        </Link>
      </div>
    </Container>
  )
}
export default Account
