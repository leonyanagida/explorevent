import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'

const useStylesCustomDrawer = makeStyles((theme) => ({
  drawer: {
    position: 'absolute',
    right: '-1em',
    backgroundColor: 'white',
    height: '100vh',
    top: '100%',
    zIndex: 10,
    [theme.breakpoints.up('md')]: {
      visibility: 'hidden',
    },
  },
}))

const CustomDefaultDrawer = (props: {
  children: any
  openDrawer: boolean
  onClose: (event: React.ChangeEvent) => any
  onOpen: (open: React.ChangeEvent) => any
}) => {
  const classes = useStylesCustomDrawer()
  return (
    <Slide direction="left" in={props.openDrawer} mountOnEnter unmountOnExit>
      <div className={classes.drawer}>{props.openDrawer && props.children}</div>
    </Slide>
  )
}

export default CustomDefaultDrawer
