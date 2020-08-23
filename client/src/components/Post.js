import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import '../styles/Post.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
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
}));

function Post() {
    const classes = useStyles();

    const handleClick = () =>{

    }
    return (
        <div className='post'>
            {/* avatar + username */}
            <div className='post__header'>
                <div className='post__avatar'>
                  <Box pr={2}>
                     <Avatar src='assets/avatar-pic.jpg' className={classes.small}/>
                  </Box>

                  <div className='post__usernameLocation'>
                      <p className='post__username'><strong>username</strong></p>
                      <p className='post__location'>Tbilisi</p>
                  </div>
                </div>
         
                
                <IconButton className='post__options'
                  aria-label="more"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
            </div>
              
            {/* photo */}
            <img className='post__image' src="assets/post.jpg" alt="post image"/>

            {/* like comment send save buttons */}
            <div className="post__controls">
                <div className="post__likeSaveSend">
                  <img src="icons/like.svg" alt="like"/>
                  <img src="icons/comment.svg" alt="comment"/>
                  <img src="icons/send.svg" alt="send"/>
                </div>
     
                <img src="icons/save.svg" alt="save"/>
            </div>
            {/* caption and comments */}
            
        </div>
    )
}

export default Post
