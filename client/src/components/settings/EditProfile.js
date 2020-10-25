import React, { useState, useRef } from "react";
import {
  Avatar,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useStateValue } from "../../context/StateProvider";
import StyledCropper from "../ImageCropper/ImageCropper";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  formControl: {
    width: 310,
    marginTop: 10,
  },
  listItemText: {
    padding: 20,
    borderTop: "1px solid lightgray",
    justifyContent: "center",
    fontWeight: 500,
  },
}));

function EditProfile() {
  const { state, dispatch } = useStateValue();
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);
  const [profilePicSelected, setProfilePicSelected] = useState(null);
  const [uploadedPic, setUploadedPic] = useState(null);
  const classes = useStyles();
  const inputFile = useRef(null);

  const handleClickOpen = () => {
    setProfilePicSelected(false);
    setOpen(true);
    
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const onFileChange = async (e) => {
    let file = e.target.files[0];

    if (file) {
      setProfilePicSelected(true);
      setUploadedPic(await toBase64(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadPhoto = () => {
    inputFile.current.click();
  };

  const handleListItemClick = () => {};

  return (
    <div>
      {/* Avatar, username, change profile pic */}
      <div className="editprofile__changeAvatar">
        <Avatar
          className={classes.small}
          src={state.avatar ? state.avatar : "assets/avatar-pic.jpg"}
        />
        <div style={{ marginLeft: 20 }}>
          <p className="editprofile__username">alex_kvashilava</p>
          <p
            onClick={handleClickOpen}
            style={{
              fontWeight: 500,
              color: "#1a94ff",
              margin: 0,
              cursor: "pointer",
            }}
          >
            Change Profile Photo
          </p>
        </div>
        <input
          type="file"
          onChange={onFileChange}
          ref={inputFile}
          style={{ display: "none" }}
        />
      </div>

      {/* Form field */}
      <form action="POST" className="editprofile__form">
        {/* Change Name */}
        <div className="form__name form__field">
          <aside>
            <label>Name</label>
          </aside>
          <div style={{ width: 250 }}>
            <input className="editprofile__formInput" type="text" />
            <p className="helper__text">
              Help people discover your account by using the name you're known
              by: either your full name, nickname, or business name.
            </p>
          </div>
        </div>

        {/* Change Username */}
        <div className="form__username form__field">
          <aside>
            <label>Username</label>
          </aside>
          <div style={{ width: 250 }}>
            <input className="editprofile__formInput" type="text" />
            <p className="helper__text">
              In most cases, you'll be able to change your username back to
              alex_kvashilava for another 14 days.
            </p>
          </div>
        </div>

        {/* Change Bio */}
        <div className="form__bio form__field">
          <aside>
            <label>Bio</label>
          </aside>
          <textarea
            style={{ resize: "vertical", height: 50 }}
            className="editprofile__formInput"
            type="text"
          />
        </div>

        {/* Change Email */}
        <div className="form__email form__field">
          <aside>
            <label>Email</label>
          </aside>
          <input className="editprofile__formInput" type="text" />
        </div>

        {/* Change Gender */}
        <div className="form__email form__field">
          <aside>
            <label>Gender</label>
          </aside>
          <FormControl className={classes.formControl}>
            <Select
              value={gender}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Prefer-not">Prefer not to say</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </div>

        <button type="submit">Submit</button>
      </form>

      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth
        maxWidth="sm"
        style={{ textAlign: "center" }}
      >
        
        {!profilePicSelected ? (
          <>
          <DialogTitle id="simple-dialog-title">Change Profile Photo</DialogTitle>
          <List>
            <ListItem
              className={classes.listItemText}
              button
              onClick={() => handleUploadPhoto()}
              style={{ color: "#1a94ff" }}
            >
              Upload photo
            </ListItem>
            <ListItem
              className={classes.listItemText}
              button
              onClick={() => handleListItemClick()}
              style={{ color: "red" }}
            >
              Remove current photo
            </ListItem>
            <ListItem
              className={classes.listItemText}
              button
              onClick={() => handleClose()}
            >
              Cancel
            </ListItem>
          </List>
          </>
        ) : (
          <div style={{ height: 150, display: 'flex', alignItems:"center", justifyContent: "center"}}>
            <p>Profile photo was uploaded successfully!</p>
            <CheckCircleOutlineIcon style={{color: "green", marginLeft: 10}}/>
            </div>
        )}
      </Dialog>
    </div>
  );
}

export default EditProfile;
