import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const alertDeleteEventDialogStyles = makeStyles(() => ({
  alertBtnContainer: {
    textAlign: 'right',
  },
  alertModal: {
    backgroundColor: '#fff',
    borderRadius: 3,
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    margin: '40px auto',
    marginTop: '25%',
    maxWidth: '80%',
    padding: 20,
    position: 'relative',
    textAlign: 'left',
    width: 550,
    zIndex: 2,
  },
  alertOuterStyle: {
    height: '100%',
    left: 0,
    overflow: 'auto',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100,
  },
  alertOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    position: 'fixed',
    top: 0,
    width: '100%',
  },
}))

const AlertDialog = (props: { open: boolean; onConfirm: (confirm: boolean) => any }) => {
  const classes = alertDeleteEventDialogStyles()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeletingEvent, setIsDeletingEvent] = useState<boolean>(false)

  useEffect(() => {
    setIsOpen(props.open)
  }, [])

  const handleConfirm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Send the confirmation to delete the event
    props.onConfirm(true)
    setIsDeletingEvent(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    props.onConfirm(false)
  }

  return (
    <div className={classes.alertOuterStyle}>
      <div
        style={{
          display: isOpen ? 'block' : 'none',
        }}
      >
        <div className={classes.alertOverlay} onClick={handleClose} />
        <div onClick={handleClose} />
        <div className={classes.alertModal}>
          <h3>Are you sure you want to delete this event?</h3>
          <p>This action will permanently delete the event and cannot be undone!</p>
          <div className={classes.alertBtnContainer}>
            <Button onClick={handleClose} disabled={isDeletingEvent}>
              {!isDeletingEvent && 'Cancel'}
            </Button>
            <Button onClick={handleConfirm} color="secondary" autoFocus disabled={isDeletingEvent}>
              {isDeletingEvent ? 'Deleting Event...' : 'Agree'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertDialog
