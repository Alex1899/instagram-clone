import React, { useState, useEffect } from "react";
import "../styles/ProfilePost.css";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem, InputBase } from "@material-ui/core";
import { useStateValue } from "../context/StateProvider";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

function ProfilePost({ post }) {
  const classes = useStyles();
  const { state, dispatch } = useStateValue();

  const [anchorEl, setAnchorEl] = useState(null);
  const [edditing, setEdditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // if user has liked post already
  let bool =
    post.userLikedList.length > 0
      ? post.userLikedList.includes(state.userId)
      : false;
  const [liked, setLiked] = useState(bool);

  const [likesCount, setLikeCount] = useState(post.userLikedList.length);
  const [imageAlreadyLiked, setAlreadyLiked] = useState(null);
  const [caption, setCaption] = useState(post.caption);
  const [postComments, setPostComments] = useState(post.comments);
  const [comment, setComment] = useState("");

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

  const optionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
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

  // post comment
  const postComment = () => {
    let comtext = comment;
    setPostComments([
      ...postComments,
      {
        text: comment,
        username: state.user,
      },
    ]);
    setComment("");

    axios
      .post("/api/posts/comment", {
        postId: post._id,
        comment: comtext,
        username: state.user,
      })
      .then((res) => {
        console.log("response => ", res.data.comments);
        setPostComments(res.data.comments);
      })
      .catch((e) => console.log(e));
  };

  const incrementLikeCount = () => {
    axios
      .post("/api/posts/like", {
        postId: post._id,
        id: state.userId,
        incrementCount: liked,
      })
      .then((response) => console.log("new likescount", response.data))
      .catch((e) => console.log(e));
  };

  const deletePost = (postId) => {
    axios
      .delete(`/api/posts/delete/${postId}`)
      .then((res) => {
        console.log(res.data);
        setAnchorEl(null);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const editCaption = (postId) => {
    setEdditing(false);
  };

  return (
    <DialogContent
      style={{
        // height: 500,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Grid maybe */}

      <Grid container style={{ display: "flex" }} justify="center">
        <Grid
          item
          xs={12}
          sm={7}
          lg={8}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img className="gridImage" src={post.imageId} alt="post image" />
        </Grid>

        <Grid item xs={12} sm={7} lg={4}>
          <div className="profilePost__section">
            <div>
              {/* header */}
              <div className="profilePost__header">
                <div className="profilePost__avatar">
                  <Box pr={2}>
                    <Avatar
                      src="assets/avatar-pic.jpg"
                      className={classes.small}
                    />
                  </Box>

                  <div className="profilePost__usernameLocation">
                    <p className="profilePost__username">
                      <strong>{state.user}</strong>
                    </p>
                    <p className="profilePost__location">Tbilisi</p>
                  </div>
                </div>

                <IconButton
                  className="profilePost__options"
                  aria-label="more"
                  onClick={optionsClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => deletePost(post._id)}>
                    Delete Post
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setEdditing(true);
                      setAnchorEl(null);
                    }}
                  >
                    Edit
                  </MenuItem>
                </Menu>
              </div>
              <hr className="line" />

              {/* caption and comments */}
              <div className="profilePost__captionComments">
                <div className="profilePost__caption">
                  {!edditing ? (
                    caption && (
                      <div
                        style={{ display: "flex", marginBottom: 20 }}
                        // className="profilePost__avatarUsername"
                      >
                        <Box pr={2}>
                          <Avatar
                            src="assets/avatar-pic.jpg"
                            className={classes.small}
                          />
                        </Box>
                        <p style={{ margin: 0, padding: 0 }}>
                          <strong style={{ marginRight: 5 }}>
                            {state.user}
                          </strong>
                          {caption}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="profilePost__editCaption">
                      <InputBase
                        value={caption}
                        onChange={handleCaptionChange}
                        fullWidth
                        multiline
                        autoFocus={true}
                        placeholder={!caption && "Add caption..."}
                        style={{ fontSize: 14 }}
                      />
                      <p
                        className="profilePost__editCaptionBtn"
                        style={{ cursor: "pointer" }}
                        onClick={() => editCaption(post._id)}
                      >
                        <strong>Edit</strong>
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="profilePost__comments"
                  style={{
                   
                    maxHeight: !caption ? 260 : 210,
                    overflowY: "auto",
                  }}
                >
                  {postComments &&
                    postComments.map((comment, i) => {
                      if (comment.text)
                        return (
                          <div
                            style={{ display: "flex", marginBottom: 20 }}
                            // className="profilePost__avatarUsername"
                          >
                            <Box pr={2}>
                              <Avatar
                                src="assets/avatar-pic.jpg"
                                className={classes.small}
                              />
                            </Box>
                            <p style={{ margin: 0, padding: 0 }}>
                              <strong style={{ marginRight: 5 }}>
                                {comment.username}
                              </strong>
                              {comment.text}
                            </p>
                          </div>
                        );
                    })}
                </div>
              </div>
            </div>

            <div className="profilePost__sectionBottom">
              {/* like comment send save buttons */}
              <div className="profilePost__controls">
                <div className="profilePost__likeCommentSend">
                  <img
                    onClick={() => {
                      likeClick();
                    }}
                    src={
                      liked
                        ? "icons/like/black-like.svg"
                        : "icons/like/like.svg"
                    }
                    alt="like"
                  />

                  <img src="icons/comment/comment.svg" alt="comment" />

                  <img src="icons/send/send.svg" alt="send" />
                </div>
                {!saved ? (
                  <BookmarkBorderIcon onClick={saveClick} fontSize="large" />
                ) : (
                  <BookmarkIcon onClick={saveClick} fontSize="large" />
                )}
              </div>
              <p className="profilePost__likeCount">
                <strong>
                  {likesCount > 0 &&
                    (likesCount > 1
                      ? likesCount + " likes"
                      : likesCount + " like")}
                </strong>
              </p>

              {/* Add comment */}
              <div className="profilePost__addComment">
                <InputBase
                  value={comment}
                  onChange={handleCommentChange}
                  fullWidth
                  multiline
                  placeholder="Add a comment..."
                />
                <p
                  className="profilePost__postButton"
                  style={!comment ? { opacity: 0.5 } : { cursor: "pointer" }}
                  onClick={postComment}
                >
                  <strong>Post</strong>
                </p>
              </div>
            </div>

            {/* comments */}
          </div>
        </Grid>
      </Grid>
    </DialogContent>
  );
}

export default ProfilePost;
