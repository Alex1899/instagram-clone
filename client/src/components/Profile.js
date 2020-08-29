import React, { useState } from 'react';
import Header from './Header';
import { withStyles } from '@material-ui/core/styles';
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
    const [ selectedImage, setSelectedImage ] = useState('');
    const [ open, setOpen] = useState(false);
    const [ caption, setCaption ] = useState('');
    const { state, dispatch } = useStateValue();
    const [ uploading, setUploading ] = useState(false);
    const history = useHistory();

    const onFileChange = (e) => {
        let image = URL.createObjectURL(e.target.files[0]);
        console.log('image path', image);
        setSelectedImage(image);

    }

    const onFileUpload = (e) => {

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
          imageUrl: selectedImage,
      })
      .then(response => {
          console.log(response.data);
          setOpen(false);
          setUploading(false);
          history.push('/');


      })
      .catch(error => console.log(error))

    };

    const saveCaption = (e) => {
        setCaption(e.target.value);

    }

    

    return (
        <div className="profile">

            {/* avatar, username */}
           {/* Create post, Posts, Saved,  */}
           
            {/* Create post should display a popup, where u can upload an image
                and add a caption, then create a post */}


             <Button  variant="contained" color="default" onClick={handleClickOpen}>
               Create Post
             </Button>
            <Dialog fullWidth={true} maxWidth="md"   onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Upload your photo to create a post
              </DialogTitle>
              <DialogContent dividers style={{minHeight: 500}}>
                  {!uploading ? 
                       !selectedImage ? (
                          <div className="profile__uploadImage">
                           <input type="file" onChange={onFileChange} />
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
