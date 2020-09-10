import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import "../styles/Header.css";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import SendIcon from "@material-ui/icons/Send";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  listItemText: {
    fontSize: 14,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    width: 200,
  },
})((props) => (
  <Menu
    elevation={2}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: "#f2f2f2",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "theme.palette.common.white",
      },
    },
  },
}))(MenuItem);

//Component
function Header() {
  const classes = useStyles();
  const { state, dispatch } = useStateValue();
  const [onHome, setOnHome] = useState(true);
  const [onDirect, setOnDirect] = useState(undefined);
  const [onProfile, setOnProfile] = useState(undefined);
  const [anchorE1, setAnchorE1] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchPressed, setSearchPressed] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!state.user) {
      history.push("/login");
    }
  }, [state]);

  // dropdown menu
  const handleClick = (e) => {
    setAnchorE1(e.currentTarget);
    console.log(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorE1(null);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchPressed(true);
    axios.get(`http://localhost:9000/users/${searchText}`).then((res) => {
      console.log(res.data);
      setSearchResult(res.data);
    });
  };

  // navbar buttons
  const homeClick = () => {
    if (!onHome) setOnHome(true);
    setOnDirect(false);
    setOnProfile(false);
    history.push("/");
  };

  const directClick = () => {
    if (!onDirect) setOnDirect(true);
    setOnHome(false);
    setOnProfile(false);
    // history.push('/direct')
  };

  const avatarClick = (e) => {
    if (!onProfile) setAnchorE1(null);
    setOnProfile(true);
    setOnHome(false);
    setOnDirect(false);
    history.push("/profile");
  };

  const logoutClick = () => {
    dispatch({
      type: "LOGOUT_USER",
      payload: {
        user: null,
      },
    });
  };

  return (
    <div className="header">
      <div className="header__navbar">
        <img
          className="header__image"
          src="assets/Instagram-Logo.png"
          onClick={homeClick}
        />
        {/* search bar */}
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              className="header__search"
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search..."
            />

            <SearchIcon
              onClick={handleSearchClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          {/* below will add padding to header so ??? */}
          {/* <div style={{ display: !searchPressed ? "none" : null }}>
            {searchResult && (
              <div style={{ display: "flex" }}>
                <Box pr={2}>
                  <Avatar src={searchResult.avatar} className={classes.small} />
                </Box>
                <p>{searchResult.username}</p>
              </div>
            )}
          </div> */}
        </div>

        {/* navbar home, direct messaging, list of who liked ur pics, go to user profile  */}
        <div className="header__menu">
          <IconButton onClick={homeClick}>
            <img
              src={onHome ? "icons/home/black-home.svg" : "icons/home/home.svg"}
              alt="home"
            />
          </IconButton>
          <IconButton onClick={directClick}>
            <img
              src={
                onDirect ? "icons/send/black-send.svg" : "icons/send/send.svg"
              }
              alt="direct"
            />
          </IconButton>
          <IconButton onClick={handleClick}>
            <Avatar src="assets/avatar-pic.jpg" className={classes.small} />
          </IconButton>
          {/* dropdown menu */}
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorE1}
            ke
            open={Boolean(anchorE1)}
            onClose={handleClose}
          >
            <StyledMenuItem onClick={avatarClick}>
              <ListItemIcon>
                <AccountCircleIcon
                  style={{ color: "black" }}
                  fontSize="small"
                />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Profile"
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <SendIcon style={{ color: "black" }} fontSize="small" />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Direct"
              />
            </StyledMenuItem>
            <hr />
            <StyledMenuItem onClick={logoutClick}>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Log Out"
              />
            </StyledMenuItem>
          </StyledMenu>
        </div>
      </div>
    </div>
  );
}

export default Header;
