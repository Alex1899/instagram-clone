import { Avatar, FormControl, Grid, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../../styles/settings/EditProfile.css";
import { useStateValue } from "../../context/StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import $ from "jquery";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

function Settings() {
  const { state, dispatch } = useStateValue();
  const [editProfile, setEditProfile] = useState(true);
  const [changePassword, setChangePassord] = useState(null);
  const [avatar, setAvatar] = useState("");

  const handleClick = (e) => {
    if (!$(e.target).hasClass("pressed")) {
      $(".option").removeClass("pressed");
      $(e.target).addClass("pressed");
    }

    if ($(e.target).hasClass("editProfile")) {
      if (!editProfile) {
        setChangePassord(false);
        setEditProfile(true);
      }
    }

    if ($(e.target).hasClass("changePassword")) {
      if (!changePassword) {
        setEditProfile(false);
        setChangePassord(true);
      }
    }
    return
  };

  const updateAvatar = () => {};

  return (
    <Grid container justify="center">
      <Grid
        item
        sm={10}
        style={{
          background: "white",
          border: "1px solid lightgray",
          display: "flex",

          maxWidth: 900,
        }}
      >
        <Grid
          item
          sm={4}
          className="editprofile__optionsDiv"
          style={{ borderRight: "1px solid lightgray" }}
        >
          <button onClick={handleClick} className="option editProfile pressed">
            Edit Profile
          </button>
          <button onClick={handleClick} className="option changePassword">
            Change Password
          </button>
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
            justifyContent: "center",
          }}
        >
          {editProfile && <EditProfile />}
          {changePassword && <ChangePassword />}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Settings;
