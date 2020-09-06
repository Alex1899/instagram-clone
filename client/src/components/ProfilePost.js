import React from "react";
import "../styles/ProfilePost.css";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

function ProfilePost({ imageUrl, likeCount, commentsCount }) {
  return (
    <Grid item lg={3} >
      <img className="profilePost__image" src={imageUrl} alt="Post image" />
    </Grid>
  );
}

export default ProfilePost;
