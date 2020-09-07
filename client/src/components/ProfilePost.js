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

function ProfilePost({ post }) {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const optionsClick = () => {
    //
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle  id="customized-dialog-title" onClose={handleClose}/>
      <DialogContent
        style={{
          // height: 500,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Grid maybe */}
        <Grid container style={{ width: 900 }}>
          <Grid item>
            <img src={post.imageUrl} alt="post image" />
          </Grid>
          <Grid item>
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
              </div>

              {/* comments */}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ProfilePost;
