import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import nicheGroupImg from '../assets/img/nichegroup.jpg'

const nicheStyles = makeStyles((theme) => ({
  nicheHead: {
    display: 'flex',
    marginTop: '2em',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  nicheImg: {
    marginTop: '5em',
    maxHeight: '30em',
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      marginTop: '1em',
      width: '100%',
    },
  },
  nicheText: {
    flexGrow: 1,
    paddingRight: '5em',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
    },
  },
  nicheTextTitle: {
    fontSize: '3em',
    marginTop: '2em',
  },
}))

const Niche = () => {
  const classes = nicheStyles()

  return (
    <Container maxWidth="md">
      <div className={classes.nicheHead}>
        <div className={classes.nicheText}>
          <h1 className={classes.nicheTextTitle}>Find Your Niche</h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet, consectetur, adipisci velit."
          </p>
        </div>
        <img className={classes.nicheImg} src={nicheGroupImg} alt="Event" />
      </div>
      <div>
        <div>
          <h1 className={classes.nicheTextTitle}>Bring Together a Community</h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
            ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
            nulla pariatur.
            <br />
            <br />
            Eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
            laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
            voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            aliquam quaerat voluptatem.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Niche
