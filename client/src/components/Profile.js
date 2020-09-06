import React, { useState, useEffect } from "react";
import Header from "./Header";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import { useStateValue } from "../context/StateProvider";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import ProfilePost from "../components/ProfilePost";
import "../styles/Profile.css";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import StyledCropper from "./ImageCropper/ImageCropper";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { readFile } from "../components/ImageCropper/utils";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24),
    marginLeft: 90,
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 800,
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

function Profile() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchPosts, setFetchPosts] = useState(true);
  const { state, dispatch } = useStateValue();
  const history = useHistory();
  const matches = useMediaQuery("(max-width:300px)");

  useEffect(() => {
    if (fetchPosts) {
      axios
        .get("http://localhost:9000/posts")
        .then((response) => {
          console.log(response.data);
          setPosts(response.data.posts);
          setFetchPosts(false);
        })
        .catch((error) => console.log(error));
    }
  }, [fetchPosts]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="profile">
      {/* avatar, username */}
      <div className="profile__info">
        <Avatar src="assets/avatar-pic.jpg" className={classes.large} />
        <div className="profile__userDetails">
          <p style={{ fontSize: 30, marginBottom: 10 }}>{state.user}</p>
          <div className="profile__userFollowersCount">
            <p>
              <strong>26</strong> posts
            </p>
            <p>
              <strong>1036</strong> followers
            </p>
            <p>
              <strong>873</strong> following
            </p>
          </div>
          <p className="profile__username">ალეკო</p>
          <p className="profile__userBio">What is real will prosper.</p>
        </div>
      </div>
      <hr className="line" />

      {/* Create post, Posts, Saved,  */}
      <div className="profile__postSection">
        <div className="profile__postSectionNav">
          <p onClick={handleClickOpen}>CREATE POST</p>
          <p>POSTS</p>
          <p>SAVED</p>
          <p>TAGGED</p>
        </div>
      </div>

      <Grid container justify="center">
        <Grid item style={{ maxWidth: 900 }}>
          <Grid container spacing={4}>
            {posts &&
              posts.map((post) => {
                return (
                  <Grid
                    // style={{ width: 250, height: 300}}
                    key={post._id}
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                  >
                    <img
                      className="profile__images"
                      src={post.imageUrl}
                      alt="Post image"
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>

      {/* create post dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Upload your photo
        </DialogTitle>
        <StyledCropper />
      </Dialog>
    </div>
  );
}

export default Profile;
