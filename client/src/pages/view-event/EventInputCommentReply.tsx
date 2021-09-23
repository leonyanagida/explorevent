import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import CustomSnackBar from "../../components/CustomSnackbar";
import EventCommentReply from "./EventCommentReply";

const eventInputCommentReplyStyles = makeStyles((theme) => ({
  btnHidden: {
    display: "none",
    paddingLeft: 0,
  },
  btnNotHidden: {
    display: "block",
    marginBottom: "-1.5em",
    paddingLeft: 0,
  },
  cancelBtn: {
    marginLeft: theme.spacing(2),
  },
  commentBtn: {
    backgroundColor: "#065fd4",
    color: "white",
    "&:hover": {
      backgroundColor: "#065fd4",
    },
    marginLeft: theme.spacing(2),
  },
  commentReplyContainer: {
    marginTop: "1em",
  },
  commentContainer: {
    paddingLeft: "2.5em",
  },
  eventCommentSnackbar: {
    maxWidth: 300,
    margin: "auto",
  },
  input: {
    marginTop: "0.5em",
    width: "100%",
  },
  inputBtns: {
    marginTop: "1em",
    textAlign: "right",
  },
}));

const EventInputCommentReply = (props: any) => {
  const classes = eventInputCommentReplyStyles();
  const { user } = useContext(UserContext);
  const [inputData, setInputData] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);
  const [isDeletingCommentError, setIsDeletingCommentError] =
    useState<boolean>(false);
  const [tempCommentReplies, setTempCommentReplies] = useState<[]>([]);
  const [isHidden, setisHidden] = useState<boolean>(true);

  const commentInputHandler = (event: any) => {
    return setInputData(event.target.value);
  };

  const removeEventCommentDeleteErrorHandler = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return setIsDeletingCommentError(false);
    }
    setIsDeletingCommentError(false);
  };

  const commentInputSubmitHandler = async () => {
    // Set to true to display the loading animation
    setIsSubmittingComment(true);
    try {
      // Don't let the user leave a comment if they are not logged in
      if (!user.id) return;
      // Event comment API
      await axios
        .post("/api/comments/new", {
          creatorId: user.id,
          eventId: props.eventIdValue,
          replyToId: props.replyToCommentId, // Should be the same as the reply comment's id
          text: inputData,
        })
        .then((res: any) => {
          // We need the comment data, username ,and id to create a reply comment
          // onInputCommentSubmit={(value: any) => setTempNewUserComment((comment: any) => comment.concat(value))}
          setTempCommentReplies((comment: any) =>
            comment.concat({
              comment: res.data.comment,
              username: user.username,
            })
          );
        });
      // Send the user's comment from the child component to the parent component
      // Clear the user's comment since we already submitted it to the server
      setInputData("");
      // Hide the reply comment input
      setisHidden(true);
      // We are done setting the data
      setIsSubmittingComment(false);
    } catch (err) {
      setIsSubmittingComment(false);
    }
  };

  const deleteAndFilterEventComments = async ({
    creatorId,
    commentId,
    eventId,
    userId,
  }: {
    creatorId: string;
    commentId: string;
    eventId: string;
    userId: string;
  }) => {
    // Application state: Do not run this function if the user is not logged in
    if (!user.id) return;
    // Remove previous errors
    setIsDeletingCommentError(false);
    try {
      // Remove the comment from the database
      await axios
        .post(`/api/comments/delete`, {
          creatorId: creatorId,
          commentId: commentId,
          eventId: eventId,
          userId: userId,
        })
        .then(() => {
          // NOTE:
          // Make sure to remove the comment from the database before removing the comment from the client state.
          // This way we can display errors if there is an error removing the user's comment
          //
          // Check and remove the comment that needs to be deleted from event data in the parent component
          props.onEventCommentReplyDelete(commentId);
        });
    } catch (err) {
      setIsDeletingCommentError(true);
    }
  };

  return (
    <div>
      <div className={classes.commentReplyContainer}>
        <div className={isHidden ? classes.btnHidden : classes.btnNotHidden}>
          <Input
            className={classes.input}
            placeholder="Leave a public comment..."
            inputProps={{ "aria-label": "description" }}
            onChange={(event) => commentInputHandler(event)}
            value={inputData}
            disabled={!user.id}
          />
          <div className={classes.inputBtns}>
            <Button
              className={classes.cancelBtn}
              onClick={() => {
                setInputData("");
                setisHidden(true);
              }}
              disabled={isSubmittingComment ? true : false}
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
      </div>
      {user.id ? (
        <Button
          size="small"
          className={isHidden ? classes.btnNotHidden : classes.btnHidden}
          onClick={() => setisHidden(!isHidden)}
        >
          Reply to comment
        </Button>
      ) : null}
      <div className={classes.commentContainer}>
        {tempCommentReplies.length
          ? tempCommentReplies
              .slice(0)
              .reverse()
              .map((reply: any) => {
                return (
                  <div key={reply.comment._id + reply.comment.createdAt}>
                    <EventCommentReply
                      commentReplyIdUser={reply.username}
                      commentReplyId={reply.comment.replyToId}
                      commentCreatorId={reply.comment.creatorId}
                      commentCreatorUsername={reply.username}
                      commentId={reply.comment._id}
                      commentCreatedAt={reply.comment.createdAt || ""}
                      commentText={reply.comment.text}
                      commentEventId={reply.comment.eventId}
                      commentLikes={reply.comment.commentLikes}
                      onEventCommentReplyDelete={(value: any) =>
                        deleteAndFilterEventComments({
                          creatorId: reply.comment.creatorId,
                          commentId: reply.comment._id,
                          eventId: reply.comment.eventId,
                          userId: user.id,
                        })
                      }
                    />
                  </div>
                );
              })
          : null}
      </div>
      <CustomSnackBar open={isDeletingCommentError} autoHideDuration={6000}>
        <Alert
          onClose={removeEventCommentDeleteErrorHandler}
          severity="error"
          className={classes.eventCommentSnackbar}
        >
          Unable to delete comment!
          <br />
          Try logging out and logging back in.
        </Alert>
      </CustomSnackBar>
    </div>
  );
};

export default EventInputCommentReply;
