import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import "../styles/Post.css";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { useStateValue } from "../context/StateProvider";
// icon imports
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  grid: {
    width: 600,
    border: "1px solid lightgray",
    marginBottom: 60,
   
  }
}));

function Post({
  postId,
  username,
  caption,
  comments,
  likeCount,
  userLiked,
  imageUrl,
}) {
  const classes = useStyles();
  const [liked, setLiked] = useState(userLiked);
  const [imageAlreadyLiked, setAlreadyLiked] = useState(null);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState(comments);
  const [likesCount, setLikeCount] = useState(likeCount);
  const [viewComments, setViewComments] = useState(false);
  const { state, dispatch } = useStateValue();

  const optionsClick = () => {
    //
  };

  useEffect(() => {
    if (imageAlreadyLiked) {
      if (liked) {
        setLikeCount(likesCount + 1);
      } else {
        setLikeCount(likesCount - 1);
      }
      incrementLikeCount();
      setAlreadyLiked(false);
    }
  }, [imageAlreadyLiked]);

  const likeClick = () => {
    setLiked(!liked);
    setAlreadyLiked(true);
  };

  // some other logic (increase like count etc..)

  const saveClick = () => {
    setSaved(!saved);
    // save to collection logic
  };

  // set comment
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const postComment = () => {
    let comtext = comment;

    setPostComments([
      ...postComments,
      {
        text: comment,
        username,
      },
    ]);

    setComment("");

    axios
      .post("/api/posts/comment", {
        postId,
        comment: comtext,
        username,
      })
      .then((res) => {
        console.log("response => ", res.data.comments);
        setPostComments(res.data.comments);
      })
      .catch((e) => console.log(e));
    // post comment
  };

  const incrementLikeCount = () => {
    axios
      .post("/api/posts/like", {
        postId,
        id: state.userId,
        incrementCount: liked,
      })
      .then((response) => console.log("new likescount", response.data))
      .catch((e) => console.log(e));
  };

  return (
    // add media queries only or use grid with xs lg md ...
    <Grid container justify="center">
      <Grid item className={classes.grid}>
        {/* avatar + username */}
        <div className="post__header">
          <div className="post__avatar">
            <Box pr={2}>
              <Avatar src="assets/avatar-pic.jpg" className={classes.small} />
            </Box>

            <div className="post__usernameLocation">
              <p className="post__username">
                <strong>username</strong>
              </p>
              <p className="post__location">Tbilisi</p>
            </div>
          </div>

          <IconButton
            className="post__options"
            aria-label="more"
            onClick={optionsClick}
          >
            <MoreVertIcon />
          </IconButton>
        </div>

        {/* photo */}
        <img className="post__image" src={imageUrl} alt="post image" />

        {/* like comment send save buttons */}
        <div className="post__controls">
          <div className="post__likeCommentSend">
            <IconButton
              onClick={() => {
                likeClick();
              }}
            >
              <img
                src={
                  liked ? "icons/like/black-like.svg" : "icons/like/like.svg"
                }
                alt="like"
              />
            </IconButton>
            <IconButton>
              <img src="icons/comment/comment.svg" alt="comment" />
            </IconButton>
            <IconButton>
              <img src="icons/send/send.svg" alt="send" />
            </IconButton>
          </div>
          {!saved ? (
            <BookmarkBorderIcon onClick={saveClick} fontSize="large" />
          ) : (
            <BookmarkIcon onClick={saveClick} fontSize="large" />
          )}

          {/* <IconButton onClick={saveClick}>
                     <img src={saved ? "icons/save/black-save.svg":"icons/save/save.svg"} alt="save"/> 
                </IconButton>  */}
        </div>
        <p className="post__likeCount">
          <strong>
            {likesCount > 0 &&
              (likesCount > 1 ? likesCount + " likes" : likesCount + " like")}
          </strong>
        </p>

        {/* caption and comments */}
        <div className="post__captionComments">
          <div className="post__caption">
            {caption && (
              <p className="post__captionText">
                <strong>{username} </strong> {caption}
              </p>
            )}
          </div>

          <div className="post__comments">
            {/* probably like list of comments and do map to p tag */}
            {!viewComments && postComments.length > 2 ? (
              <p
                onClick={(e) => setViewComments(true)}
                className="post__viewCommentsText"
              >
                View all {postComments.length} comments
              </p>
            ) : (
              postComments.map((comment, i) => {
                if (comment.text)
                  return (
                    <p key={i} className="post__captionText">
                      <strong>{comment.username} </strong>
                      {comment.text}{" "}
                    </p>
                  );
              })
            )}
          </div>

          <hr />

          <div className="post__addComment">
            <InputBase
              value={comment}
              onChange={handleChange}
              fullWidth
              multiline
              placeholder="Add a comment..."
            />
            <p
              className="post__postButton"
              style={!comment ? { opacity: 0.5 } : { cursor: "pointer" }}
              onClick={postComment}
            >
              <strong>Post</strong>
            </p>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Post;
