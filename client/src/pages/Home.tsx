import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import SearchBar from '../components/SearchBar'
import Spacer from '../components/Spacer'
import danceEventImg from '../assets/img/danceevent.jpg'
import homepageEventImg from '../assets/img/homepageevent.jpg'
import musicEventImg from '../assets/img/musicevent.jpg'
import onlineEventImg from '../assets/img/onlineevent.jpg'

const useStyles = makeStyles((theme) => ({
  eventBackground: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${homepageEventImg})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    paddingBottom: '18em',
    paddingTop: '9em',
    width: '100%',
  },
  eventContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  eventTitle1: {
    color: 'white',
    fontFamily: 'Merriweather, serif',
    fontSize: '2.5rem',
    fontWeight: 600,
    letterSpacing: '1px',
    marginTop: 0,
    textAlign: 'center',
  },
  eventTitle2: {
    fontFamily: 'Merriweather, serif',
    fontSize: '1.3rem',
    fontWeight: 500,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '0.5em',
    },
  },
  grid: {
    width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
  homeEventBenefits: {
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  homeEventBenefitsActions: {
    justifyContent: 'center',
  },
  homeEventBenefitsMedia: {
    height: 300,
  },
  homeEventBenefitsTitle: {
    fontFamily: 'Merriweather, serif',
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 'auto',
    textAlign: 'center',
  },
}))

const Home = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.eventBackground}>
        <h1 className={classes.eventTitle1}>Attend Free Events Today</h1>
        <Spacer height={'2em'} />
        <div className={classes.searchBar}>
          <SearchBar />
        </div>
      </div>
      <Spacer height={'5em'} />
      <div className={classes.eventTitle2}>
        <p>Go to events without worrying about the cost</p>
      </div>
      <Spacer height={'3em'} />
      <Container maxWidth="lg">
        <div className={classes.eventContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" className={classes.homeEventBenefits}>
                <CardContent>
                  <CardMedia className={classes.homeEventBenefitsMedia} image={danceEventImg} title="Masqerade Event" />
                  <Typography variant="h5" component="h2" className={classes.homeEventBenefitsTitle}>
                    <br />
                    Find Your Niche
                  </Typography>
                  <Typography variant="body1" component="p">
                    <br />
                    Become part of a bigger community and meet new people from all over the world
                  </Typography>
                </CardContent>
                <CardActions className={classes.homeEventBenefitsActions}>
                  <Button variant="outlined" color="primary" size="large" component={Link} to="/niche">
                    Learn More
                  </Button>
                </CardActions>
                <br />
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" className={classes.homeEventBenefits}>
                <CardContent>
                  <CardMedia className={classes.homeEventBenefitsMedia} image={onlineEventImg} title="Paella dish" />
                  <Typography variant="h5" component="h2" className={classes.homeEventBenefitsTitle}>
                    <br />
                    Events Online or In-Person
                  </Typography>
                  <Typography variant="body1" component="p">
                    <br />
                    Become part of a bigger community and meet new people from all over the world
                  </Typography>
                </CardContent>
                <CardActions className={classes.homeEventBenefitsActions}>
                  <Button variant="outlined" color="primary" size="large" component={Link} to="/onlineinperson">
                    Learn More
                  </Button>
                </CardActions>
                <br />
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" className={classes.homeEventBenefits}>
                <CardContent>
                  <CardMedia className={classes.homeEventBenefitsMedia} image={musicEventImg} title="Paella dish" />
                  <Typography variant="h5" component="h2" className={classes.homeEventBenefitsTitle}>
                    <br />
                    Meet New People
                  </Typography>
                  <Typography variant="body1" component="p">
                    <br />
                    Become part of a bigger community and meet new people from all over the world
                  </Typography>
                </CardContent>
                <CardActions className={classes.homeEventBenefitsActions}>
                  <Button variant="outlined" color="primary" size="large" component={Link} to="/meetpeople">
                    Learn More
                  </Button>
                </CardActions>
                <br />
              </Card>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}

export default Home
