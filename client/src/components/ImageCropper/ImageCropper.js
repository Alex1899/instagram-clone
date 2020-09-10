import React, { useState, useCallback, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getCroppedImg, readFile } from "./utils";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "../../styles/ImageCropper/ImageCropperStyles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { useStateValue } from "../../context/StateProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputBase from "@material-ui/core/InputBase";
import axios from "axios";
import { useHistory } from "react-router-dom";

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

const ImageCropper = ({ classes }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [fetchPosts, setFetchPosts] = useState(true);
  const [caption, setCaption] = useState("");
  const [cropping, setCropping] = useState(false);
  const [cropDone, setCropDone] = useState(false);
  const [readyToPost, setReadyToPost] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { state, disptach } = useStateValue();
  const history = useHistory();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setCropping(true);
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setReadyToPost(true);
      setCropDone(true);
    } catch (e) {
      console.error(e);
    }
  }, [selectedImage, croppedAreaPixels]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  const onFileChange = async (e) => {
    let image = await readFile(e.target.files[0]);
    console.log("image path", image);
    setSelectedImage(image);
  };

  const createPost = () => {
    setUploading(true);
    // save post in db
    axios
      .post("http://localhost:9000/posts/create", {
        userId: state.userId,
        caption,
        imageUrl: croppedImage,
      })
      .then((response) => {
        window.location.reload();
        setOpen(false);
        setUploading(false);
        console.log(response.data);
       
      })
      .catch((error) => console.log(error));
  };

  const saveCaption = (e) => {
    setCaption(e.target.value);
  };

  return (
    <>
      <DialogContent
        dividers={false}
        style={{
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!uploading ? (
          !selectedImage ? (
            <div className="profile__uploadImage">
              <input type="file" onChange={onFileChange} />
            </div>
          ) : readyToPost ? (
            <div className="profile__createPost">
              <img
                className="profile__uploadedImage"
                src={croppedImage}
                alt="uploaded image"
              />
              <InputBase
                value={caption}
                onChange={saveCaption}
                fullWidth
                multiline
                autoFocus
                placeholder="Add a caption..."
              />
            </div>
          ) : cropping ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className={classes.cropContainer}>
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div
                style={{
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="overline">Zoom</Typography>
                  <Slider
                    style={{ width: "100%", color: "black" }}
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e, zoom) => setZoom(zoom)}
                  />
                </div>

                <Button
                  onClick={showCroppedImage}
                  variant="contained"
                  color="black"
                  style={{ width: "100%" }}
                  // classes={{ root: classes.cropButton}}
                >
                  Crop
                </Button>
              </div>
            </div>
          )
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
          </div>
        )}
      </DialogContent>
      {cropDone && (
        <DialogActions>
          <Button autoFocus onClick={createPost} color="primary">
            Upload
          </Button>
        </DialogActions>
      )}
    </>
  );
};

const StyledCropper = withStyles(styles)(ImageCropper);

export default StyledCropper;
