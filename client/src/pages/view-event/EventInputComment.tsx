import React, { useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../../context/UserContext'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'

const eventInputCommentStyles = makeStyles((theme) => ({
  input: {
    width: '100%',
  },
  cancelBtn: {
    marginLeft: theme.spacing(2),
  },
  commentBtn: {
    backgroundColor: '#065fd4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#065fd4',
    },
    marginLeft: theme.spacing(2),
  },
  inputBtns: {
    marginTop: '1em',
    textAlign: 'right',
  },
}))

const EventInputComment = (props: any) => {
  const classes = eventInputCommentStyles()
  const { user } = useContext(UserContext)
  const [inputData, setInputData] = useState<string>('')
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false)

  const commentInputHandler = (event: any) => {
    return setInputData(event.target.value)
  }

  const commentInputSubmitHandler = async () => {
    // Set to true to display the loading animation
    setIsSubmittingComment(true)
    try {
      // Don't let the user leave a comment if they are not logged in
      if (!user.id) return
      // Event comment API
      await axios
        .post('/api/comments/new', {
          creatorId: user.id,
          eventId: props.eventValues._id,
          replyToId: null,
          text: inputData,
        })
        .then((res: any) => {
          const newComment = res.data
          // Get the user data
          axios.get(`/api/users/profile/${user.id}`).then((res: any) => {
            props.onInputCommentSubmit({
              comment: newComment.comment,
              username: res.data.username,
            })
          })
        })
      // Send the user's comment from the child component to the parent component
      // Clear the user's comment since we already submitted it to the server
      setInputData('')
      // We are done setting the data
      setIsSubmittingComment(false)
    } catch (err) {
      setIsSubmittingComment(false)
    }
  }

  return (
    <div>
      <Input
        className={classes.input}
        placeholder="Leave a public comment..."
        inputProps={{ 'aria-label': 'description' }}
        onChange={(event) => commentInputHandler(event)}
        value={inputData}
        disabled={!user.id}
      />
      <div className={classes.inputBtns}>
        <Button
          className={classes.cancelBtn}
          onClick={() => setInputData('')}
          disabled={inputData && !isSubmittingComment ? false : true}
        >
          Cancel
        </Button>
        <Button
          className={classes.commentBtn}
          variant="contained"
          onClick={() => commentInputSubmitHandler()}
          disabled={inputData && !isSubmittingComment ? false : true}
        >
          Comment
        </Button>
      </div>
    </div>
  )
}

export default EventInputComment
