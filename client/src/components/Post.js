import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import '../styles/Post.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';

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
    const [ liked, setLiked ] = useState(false);
    const [ saved, setSaved ] = useState(false);
    const [text, setText ] = useState('');
   

    const optionsClick = () =>{
      //
    }

    const likeClick = () => {
      setLiked(!liked);
      // some other logic (increase like count etc..)
    }

    const saveClick = () => {
      setSaved(!saved);
      // save to collection logic 
    }

    const handleChange = (e) => {
      setText(e.target.value);
      
    }

    const postComment = () => {
      console.log('Clicked Post');
      // post comment
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
                  onClick={optionsClick}
                >
                  <MoreVertIcon />
                </IconButton>
            </div>
              
            {/* photo */}
            <img className='post__image' src="assets/post.jpg" alt="post image"/>

            {/* like comment send save buttons */}
            <div className="post__controls">
                <div className="post__likeSaveSend">
                  <IconButton onClick={likeClick}>
                     <img src={liked ? "icons/black-like.svg" : "icons/like.svg"} alt="like"/>
                  </IconButton>
                  <IconButton >
                      <img src= "icons/comment.svg" alt="comment"/>
                  </IconButton>
                  <IconButton>
                      <img src="icons/send.svg" alt="send"/>
                  </IconButton>
                </div>
                <IconButton onClick={saveClick}>
                     <img src={saved ? "icons/black-save.svg":"icons/save.svg"} alt="save"/>
                </IconButton>
            </div>

            {/* caption and comments */}
            <div className="post__captionComments">
               <div className="post__caption">
                 <p className="post__captionText"><strong>alex </strong>This view is mad</p>
               </div>
               
               <div className="post__comments">
                 {/* probably like list of comments and do map to p tag */}
                 <p className="post__captionText"><strong>Theo </strong>wow this is really mad</p>
               </div> 
               <hr className="line"/>
               
               <div className="post__addComment">
                  {/* <TextField  
                     id="standard-textarea"
                     className="post__inputText"
                     rowsMax={4}
                     value={text}
                     placeholder="Add a comment..."
                     onChange={handleChange}/> */}
                     <InputBase onChange={handleChange} fullWidth multiline placeholder="Add a comment..."/>

                  <p className="post__postButton" style={!text ? {opacity: 0.5}: {fontWeight: "bold"}} onClick={postComment}>Post</p>
               </div>
               
            </div>
        </div>
    )
}

export default Post
