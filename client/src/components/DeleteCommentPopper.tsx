import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const deletePopper = makeStyles(() => ({
  deleteCommentPopperBtn: {
    marginBottom: '-1em',
  },
  moreVertIcon: {
    color: '#5b5b5b',
  },
  popperContainer: {
    position: 'relative',
    right: '10px',
  },
  popperBtn: {
    position: 'absolute',
  },
  popperInner: {
    position: 'relative',
    right: '10px',
    top: '0.5em',
  },
}))

const DeleteCommentPopper = (props: { disabled: boolean; onConfirm: (confirm: boolean) => any }) => {
  const classes = deletePopper()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const deleteCommentRef = useRef<HTMLDivElement>(null)

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

  const handleConfirm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Send the confirmation to delete the event
    props.onConfirm(true)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: any) => {
    // Clicks outside the popper will close the delete comment popper
    if (deleteCommentRef.current && !deleteCommentRef?.current?.contains(event.target)) {
      props.onConfirm(false)
      setIsOpen(false)
    }
  }

  return (
    <div className={classes.popperContainer} ref={deleteCommentRef}>
      <Button onClick={handleClick} className={classes.deleteCommentPopperBtn}>
        <MoreVertIcon className={classes.moreVertIcon} />
      </Button>
      {isOpen && (
        <div className={classes.popperInner}>
          <Button
            className={classes.popperBtn}
            color="secondary"
            size="small"
            variant="outlined"
            onClick={handleConfirm}
            disabled={props.disabled}
          >
            DELETE COMMENT
          </Button>
        </div>
      )}
    </div>
  )
}

export default DeleteCommentPopper
