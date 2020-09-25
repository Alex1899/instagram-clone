import { Avatar, FormControl, Grid, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import "../../styles/settings/EditProfile.css";
import { useStateValue } from "../../context/StateProvider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  formControl: {
    width: 310,
    marginTop: 10,
  },
}));

function EditProfile() {
  const { state, dispatch } = useStateValue();
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const classes = useStyles();

  const updateAvatar = () => {};

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <Grid container justify="center">
      <Grid
        item
        sm={10}
        style={{
          background: "white",
          border: "1px solid lightgray",
          display: "flex",
         
          maxWidth: 900
        }}
      >
        <Grid
          item
          sm={4}
          className="editprofile__optionsDiv"
          style={{ borderRight: "1px solid lightgray"}}
        >
          <button className="option">Edit Profile</button>
          <button className="option">Change Password</button>
        </Grid>
        {/* change settings section */}
        <Grid
          item
          xs={12}
          sm={8}
          style={{
            paddingTop: 15,
            marginLeft: 50,
            marginRight: 50,
            paddingBottom: 30,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div>
            {/* Avatar, username, change profile pic */}
            <div className="editprofile__changeAvatar">
              <Avatar
                className={classes.small}
                src={state.avatar ? state.avatar : "assets/avatar-pic.jpg"}
              />
              <div style={{ marginLeft: 20 }}>
                <p className="editprofile__username">alex_kvashilava</p>
                <p style={{ fontWeight: 500, color: "#1a94ff", margin: 0 }}>
                  Change Profile Photo
                </p>
              </div>
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
                    Help people discover your account by using the name you're
                    known by: either your full name, nickname, or business name.
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
                    In most cases, you'll be able to change your username back
                    to alex_kvashilava for another 14 days.
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
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Prefer-not">Prefer not to say</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EditProfile;
