import React, { useState, useEffect } from 'react';
import Header from './Header';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import '../styles/Profile.css';
import InputBase from '@material-ui/core/InputBase';
import axios from 'axios';
import { useStateValue } from '../context/StateProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import ProfilePost from '../components/ProfilePost';


const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

  const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(24),
      height: theme.spacing(24),
      marginLeft: 90
    }, 
  }));
  
      
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);



function Profile() {
    const classes = useStyles();
    const [ selectedImage, setSelectedImage ] = useState('');
    const [ open, setOpen] = useState(false);
    const [ caption, setCaption ] = useState('');
    const [ uploading, setUploading ] = useState(false);
    const [ posts, setPosts ] = useState([]);
    const [ fetchPosts, setFetchPosts ] = useState(true);
    const { state, dispatch } = useStateValue();
    const history = useHistory();

    useEffect(() => {
      if(fetchPosts){
        axios.get('http://localhost:9000/posts')
        .then(response => {
            console.log(response.data);
            setPosts(response.data.posts);
            setFetchPosts(false);
  
        })
        .catch(error => console.log(error));
      }
     
    }, [fetchPosts]);


    const onFileChange = (e) => {
        let image = URL.createObjectURL(e.target.files[0]);
        console.log('image path', image);
        setSelectedImage(image);

    }

    
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const createPost = () => {
      setUploading(true);
      // save post in db 
      axios.post('http://localhost:9000/posts/create', {
          userId: state.userId,
          caption,
          imageUrl: 'https://www.orissapost.com/wp-content/uploads/2020/03/gigi-hadid-hot-cleavage.jpg',
      })
      .then(response => {
          console.log(response.data);
          setOpen(false);
          setUploading(false);
          setFetchPosts(true);
      })
      .catch(error => console.log(error))

    };

    const saveCaption = (e) => {
        setCaption(e.target.value);

    }

    

    return (
        <div className="profile">

            {/* avatar, username */}
            <div className="profile__info">
                <Avatar src="assets/avatar-pic.jpg" className={classes.large}/> 
                <div className="profile__userDetails">
                    <p style={{fontSize: 30, marginBottom: 10}}>{state.user}</p>
                    <div className="profile__userFollowersCount">
                        <p><strong>26</strong> posts</p>
                        <p><strong>1036</strong> followers</p>
                        <p><strong>873</strong> following</p>
                    </div>
                     <p className="profile__username">ალეკო</p>
                     <p className="profile__userBio">What is real will prosper.</p>
                </div>
            </div>
            <hr className="line"/>


           {/* Create post, Posts, Saved,  */}
           <div className="profile__postSection">
               <div className="profile__postSectionNav">
                   <p onClick={handleClickOpen}>CREATE POST</p>
                   <p>POSTS</p>
                   <p>SAVED</p>
                   <p>TAGGED</p>
               </div>
           </div>

           <div className="profile__userPostsSection">

              {posts && posts.map(post => {
                return <div className="profile__userPosts">
                          <ProfilePost 
                              key={post._id}
                              imageUrl={post.imageUrl}
                              likeCount={post.userLikedList.length}
                              commentsCount={post.comments.length}
                          /> 
                       </div> 
              })}
           </div>
           


           
            <Dialog fullWidth={true} maxWidth="md"   onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Upload your photo to create a post
              </DialogTitle>
              <DialogContent dividers style={{minHeight: 500}}>
                  {!uploading ? 
                       !selectedImage ? (
                          <div className="profile__uploadImage">
                             <input type="file" onChange={onFileChange}/>
                          </div>
                       ) : (
                       <div className="profile__createPost">
                          <img className="profile__uploadedImage" src={selectedImage} alt="uploaded image"/>
                          <InputBase value={caption} onChange={saveCaption} fullWidth multiline placeholder="Add a caption..."/>
                       </div>
                       ) : (
                       <div className="spinning" style={{display: 'flex', alignItems: 'center'}}> 
                           <CircularProgress />
                       </div>
                       )}
                
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={createPost} color="primary">
                    Upload
                </Button>
              </DialogActions>
            </Dialog>
            

        </div>
    )
}

export default Profile
