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
  const [open, setOpen] = useState({
    createPostDialog: false,
    viewPostDialog: false,
  });

  const [viewPost, setViewPost] = useState(null);
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

  const handleClickOpen = (type, post = null) => {
    switch (type) {
      case "CREATE_POST":
        setOpen({ ...open, createPostDialog: true });

      case "VIEW_POST":
        if (post) {
          setViewPost(post);
          setOpen({ ...open, viewPostDialog: true });
        }

      default:
        return;
    }
  };

  const handleClose = (type) => {
    if (type === "VIEW_POST") {
      setOpen({ ...open, viewPostDialog: false });
    } else {
      setOpen({ ...open, createPostDialog: false });
    }
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

      <Grid container justify="center">
        <Grid item justify="center">
          <hr />
          {/* Create post, Posts, Saved,  */}
          <div className="profile__postSection">
            <div className="profile__postSectionNav">
              <p onClick={() => handleClickOpen("CREATE_POST")}>CREATE POST</p>
              <p>POSTS</p>
              <p>SAVED</p>
              <p>TAGGED</p>
            </div>
          </div>
          <Grid container style={{ maxWidth: 900 }} spacing={4}>
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
                    <div
                      onClick={() => handleClickOpen("VIEW_POST", post)}
                      className="container"
                    >
                      <img
                        className="profile__image"
                        src={post.imageUrl}
                        alt="Post image"
                      />
                      <div className="overlay">
                        <div className="divPad">
                          <img src="icons/like/small-heart.svg" alt="likes" />
                          <p>{post.userLikedList.length}</p>
                        </div>
                        <div>
                          <img
                            src="icons/comment/small-comment.svg"
                            alt="comments"
                          />
                          <p>{post.comments.length}</p>
                        </div>
                      </div>
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>

      {/* view post dialog */}
      {viewPost && (
        <Dialog
          fullWidth={true}
          maxWidth="md"
          onClose={() => handleClose("VIEW_POST")}
          aria-labelledby="customized-dialog-title"
          open={open.viewPostDialog}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => handleClose("VIEW_POST")}
          />
          <ProfilePost post={viewPost} />
        </Dialog>
      )}

      {/* create post dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={() => handleClose("CREATE_POST")}
        aria-labelledby="customized-dialog-title"
        open={open.createPostDialog}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => handleClose("CREATE_POST")}
        >
          Upload your photo
        </DialogTitle>
        <StyledCropper />
      </Dialog>
    </div>
  );
}

export default Profile;
