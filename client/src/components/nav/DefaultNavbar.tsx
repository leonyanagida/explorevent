import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import CustomDefaultDrawer from './CustomDefaultDrawer'
import exploreventLogo from '../../assets/svg/exploreventlogo.svg'

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: 'white',
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0,
    },
  },
  btnLink: {
    color: 'white',
    textDecoration: 'none',
  },
  defaultLink: {
    color: 'black',
    textDecoration: 'none',
  },
  fullList: {
    width: 'auto',
  },
  list: {
    width: 250,
  },
  logo: {
    marginRight: '0.5em',
    marginTop: '0.2em',
    width: '2em',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      display: 'none',
      visibility: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  toolbarBtn: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
      visibility: 'none',
    },
  },
  signupBtn: {
    backgroundColor: '#8541CA',
    color: 'white',
    '&:hover': {
      backgroundColor: '#6728a6',
    },
  },
}))

export default function DefaultNavbar() {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClickOutside = (event: any) => {
    // Clicks outside the popper will close the delete comment popper
    if (navRef.current && !navRef?.current?.contains(event.target)) {
      return setIsOpen(false)
    }
  }

  const toggleDrawer = (event: any) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    return isOpen ? setIsOpen(false) : setIsOpen(true)
  }

  const list = (anchor: any) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => toggleDrawer(event)}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => toggleDrawer(event)}
    >
      <List>
        {['Login', 'Sign up'].map((text, index) => (
          <ListItem button component={Link} key={text} to={text === 'Login' ? `/login` : `/signup`}>
            <ListItemIcon>{text === 'Login' ? <VpnKeyIcon /> : <PersonAddIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div>
      <AppBar position="static" className={classes.appbar}>
        <Container maxWidth="lg">
          <Toolbar>
            <Link to="/" className={classes.defaultLink}>
              <img className={classes.logo} src={exploreventLogo} alt="Explorevent Logo" />
            </Link>
            <Typography variant="h6" className={classes.title}>
              <Link to="/" className={classes.defaultLink}>
                explorevent
              </Link>
            </Typography>
            <Typography color="inherit" className={classes.toolbarBtn}>
              <Link to="/login" className={classes.defaultLink}>
                Login
              </Link>
            </Typography>
            <Button variant="contained" className={[[classes.toolbarBtn], [classes.signupBtn]].join(' ')}>
              <Link to="/signup" className={classes.btnLink}>
                Sign Up
              </Link>
            </Button>
            {['left'].map((anchor: any) => (
              <div key={anchor} ref={navRef}>
                <IconButton
                  onClick={toggleDrawer}
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
                <CustomDefaultDrawer openDrawer={isOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
                  {list(anchor)}
                </CustomDefaultDrawer>
              </div>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}
