import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStylesFooter = makeStyles(() => ({
  footerContainer: {
    marginTop: '10rem',
  },
  footerLink: {
    color: '#1A1B1F',
    opacity: 0.8,
    textDecoration: 'none',
  },
}))

const Footer = () => {
  const classes = useStylesFooter()

  return (
    <Container maxWidth="md" className={classes.footerContainer}>
      <Divider variant="middle" />
      <br />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography variant="body2" color="textSecondary" align="center" component="p">
            <Link to="/disclaimer" className={classes.footerLink}>
              Disclaimer
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="textSecondary" align="center" component="p">
            <Link to="/" className={classes.footerLink}>
              Terms of Service
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="textSecondary" align="center" component="p">
            <Link to="/" className={classes.footerLink}>
              Cookie Preferences
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="textSecondary" align="center" component="p">
            <Link to="/" className={classes.footerLink}>
              Sitemap
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <br />
      <br />
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" to="/" className={classes.footerLink}>
          explorevent
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <br />
    </Container>
  )
}

export default Footer
