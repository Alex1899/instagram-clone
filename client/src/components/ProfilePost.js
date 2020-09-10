import React, { useState } from "react";
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
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem } from "@material-ui/core";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { state, dispatch } = useStateValue();

  const optionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:9000/posts/delete/${postId}`)
      .then((res) => {
        console.log(res.data);
        setAnchorEl(null);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const editCaption = () => {};

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
          <img className="gridImage" src={post.imageUrl} alt="post image" />
        </Grid>

        <Grid item xs={12} sm={5} lg={4}>
          <div className="profilePost__comments">
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
                    <strong>{post.username}</strong>
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
                <MenuItem onClick={() => editCaption(post._id)}>Edit</MenuItem>
              </Menu>
            </div>

            {/* caption and comments */}
            <div className="profilePost__captionComments">
              <div className="profilePost__caption">
                {post.caption && (
                  <div style={{ display: "flex", alignItems: "center"}}>
                    <Box pr={2}>
                      <Avatar
                        src="assets/avatar-pic.jpg"
                        className={classes.small}
                      />
                    </Box>
                    <p className="profilePost__captionText">
                      <strong>{state.user} </strong> {post.caption}
                    </p>
                  </div>
                )}
              </div>

              <div className="profilePost__comments">
                {/* probably like list of comments and do map to p tag */}
                {post.comments &&
                  post.comments.map((comment, i) => {
                    if (comment.text)
                      return (
                        <p key={i} className="profilePost__captionText">
                          <strong>{comment.username} </strong>
                          {comment.text}{" "}
                        </p>
                      );
                  })}
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
