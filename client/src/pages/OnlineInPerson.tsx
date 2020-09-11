import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import funOnlineEventImg from '../assets/img/funonlineevent.jpg'

const onlineInPersonStyles = makeStyles((theme) => ({
  nicheHead: {
    display: 'flex',
    marginTop: '2em',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  onlineImg: {
    marginTop: '5em',
    height: '36em',
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      marginTop: '1em',
      width: '100%',
    },
  },
  nicheContent: {
    marginTop: '3em',
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

const OnlineInPerson = () => {
  const classes = onlineInPersonStyles()

  return (
    <Container maxWidth="md">
      <div className={classes.nicheHead}>
        <div className={classes.nicheText}>
          <h1 className={classes.nicheTextTitle}>
            Events Online &
            <br />
            In-Person
          </h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet.
            <br />
            <br />
            Eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem.
          </p>
        </div>
        <img className={classes.onlineImg} src={funOnlineEventImg} alt="Event" />
      </div>
      <div>
        <div className={classes.nicheText}>
          <h1 className={classes.nicheTextTitle}>Online, Live, Now!</h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam.
          </p>
        </div>
      </div>
      <div>
        <div>
          <h1 className={classes.nicheTextTitle}>Bring great memories with others</h1>
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
            aliquam quaerat voluptatem. Eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
            ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
            labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
            ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
            fugiat quo voluptas nulla aliquam quaerat voluptatem.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default OnlineInPerson
