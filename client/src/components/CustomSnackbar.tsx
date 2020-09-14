import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Slide from '@material-ui/core/Slide'

const useStylesCustomSnackBar = makeStyles(() => ({
  customSnackBarChildren: {
    left: '40%', // Transform is set to none when using the 'Slide' component from material-ui => Keep at 45% to center
    position: 'fixed',
    top: 'calc(100% - 10%)',
  },
}))

const CustomSnackBar = (props: { children: any; open: boolean; autoHideDuration: number }) => {
  const classes = useStylesCustomSnackBar()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    // Assign the timeout variable
    let timer: ReturnType<typeof setTimeout>
    // Make sure to keep the state of the parent component in the child component too!
    setIsOpen(props.open)
    // If the parent component state is false, make sure to clear the setTimeout and set the state of this component to false
    if (!props.open) {
      setIsOpen(false)
      return () => clearTimeout(timer)
    }
    // Make sure to also set the state to this component to false after the time runs out
    if (props.open) {
      timer = setTimeout(() => {
        setIsOpen(false)
      }, props.autoHideDuration)
      // Finally, clearTimeout to avoid and errors when calling the snackbar multiple times
      return () => clearTimeout(timer)
    }
  }, [props.open])

  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <div className={classes.customSnackBarChildren}>{props.children}</div>
    </Slide>
  )
}

export default CustomSnackBar
