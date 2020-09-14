import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const editPopper = makeStyles((theme) => ({
  moreVertIcon: {
    color: '#5b5b5b',
  },
  popperContainer: {
    position: 'absolute',
    right: 0,
  },
  popperBtn: {
    marginBottom: '0.5em',
    width: '100%',
  },
  popperInner: {
    maxWidth: '10em',
    position: 'relative',
    right: '10px',
    top: '0.5em',
  },
  spanContainer: {
    marginLeft: '0.5em',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
    },
  },
}))

const EditEventPopper = (props: {
  disabled: boolean
  onConfirmDelete: (confirm: boolean) => any
  onConfirmEdit: (confirm: boolean) => any
}) => {
  const classes = editPopper()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const editEventRef = useRef<HTMLDivElement>(null)

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

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleConfirmDelete = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Send the confirmation to delete the event
    props.onConfirmDelete(true)
  }

  const handleConfirmEdit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Send the confirmation to delete the event
    props.onConfirmEdit(true)
  }

  const handleClickOutside = (event: any) => {
    // Clicks outside the popper will close the delete comment popper
    if (editEventRef.current && !editEventRef?.current?.contains(event.target)) {
      props.onConfirmDelete(false)
      props.onConfirmEdit(false)
      // Set this component's state to false to close the popper
      setIsOpen(false)
    }
  }

  return (
    <span className={classes.spanContainer} ref={editEventRef}>
      <Button onClick={handleClick}>
        <MoreVertIcon className={classes.moreVertIcon} />
      </Button>
      <div className={classes.popperContainer}>
        {isOpen && (
          <div className={classes.popperInner}>
            <Button
              className={classes.popperBtn}
              color="primary"
              size="small"
              variant="outlined"
              onClick={handleConfirmEdit}
              disabled={props.disabled}
            >
              Edit Event
            </Button>
            <br />
            <Button
              className={classes.popperBtn}
              color="secondary"
              size="small"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={props.disabled}
            >
              Delete Event
            </Button>
          </div>
        )}
      </div>
    </span>
  )
}

export default EditEventPopper
