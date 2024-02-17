import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, updateProfile } from "../features/auth/authSlice";
import ProfileUpdateModal from "./ProfileUpdateModal";
// import { useNavigate } from "react-router-dom";
import {
  Typography,
  Avatar,
  Card,
  Box,
  Grid,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Use faEdit for the edit icon
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import CustomButton from "./CustomButton";
import WatchList from "./WatchList";
import UserAvatarUpdate from "./UserAvatarUpdate";
import { quotes } from "./quotes";

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    surname: "",
    age: "",
    gender: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });

  const [avatarModalOpen, setAvatarModalOpen] = useState(false); // State to manage avatar modal visibility

  // const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [selectedQuote, setSelectedQuote] = useState({ quote: "", author: "" }); // Updated to store both

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    // Initialize form with user data when available
    if (user) {
      setProfile({ ...user });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ ...profile, userId: user.id })).unwrap();
      // Dispatch fetchUserProfile to refresh user data
      dispatch(fetchUserProfile(user.id));
      alert("Profile updated successfully!");
      setProfileModalOpen(false);
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  // Select a random quote when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[randomIndex]); // Update to set the entire quote object
  }, []);

  if (!user) {
    return (
      <Typography variant='body1' sx={{ mt: 2 }}>
        Loading user information...
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #FF8E53 30%, #123456 90%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
            <Box
              sx={{
                p: 3,
                width: "100%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar
                alt='User Avatar'
                src={user?.avatar_url || "https://robohash.org/default?set=set5"}
                sx={{ width: 200, height: 200, mb: 2, mr: 5 }}
              />
            </Box>
            <IconButton onClick={() => setAvatarModalOpen(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </IconButton>

            <Typography variant='h5' sx={{ color: "text.primary", mb: 1 }}>
              {`${user.name ?? ""} ${user.surname ?? ""}`}
            </Typography>
            <Typography variant='body1' sx={{ color: "text.secondary", mb: 1 }}>
              Age: {user.age}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", width: "60%", mb: 3 }}>
            <IconButton href={`https://www.facebook.com/${user.facebook}`} target='_blank'>
              <FontAwesomeIcon icon={faFacebookF} size='lg' />
            </IconButton>
            <IconButton href={`https://www.instagram.com/${user.instagram}`} target='_blank'>
              <FontAwesomeIcon icon={faInstagram} size='lg' />
            </IconButton>
            <IconButton href={`https://www.linkedin.com/in/${user.linkedin}`} target='_blank'>
              <FontAwesomeIcon icon={faLinkedinIn} size='lg' />
            </IconButton>
          </Box>
          <CustomButton
            sx={{ mb: 2 }}
            variant='contained'
            onClick={() => setProfileModalOpen(true)}
          >
            Update Profile
          </CustomButton>

          <ProfileUpdateModal
            open={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            profile={profile}
            onProfileChange={handleProfileChange}
            onSave={handleProfileSave}
          />
          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={avatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={avatarModalOpen}>
              <Box sx={modalStyle}>
                {" "}
                <UserAvatarUpdate onClose={() => setAvatarModalOpen(false)} />
              </Box>
            </Fade>
          </Modal>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #123456 30%, #FF8E53 90%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Box sx={{ p: 3, width: "70%" }}>
            <Typography
              variant='body1'
              gutterBottom
              component='div'
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Quote of the Day:
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: "text.secondary",
                mb: 1,
                fontSize: "2rem",
                fontStyle: "italic", // Makes the text italic
                fontWeight: "bold", // Makes the text bold
                fontFamily: "'Roboto Slab', serif", // Sets the font to Roboto Slab, fall back to serif
              }}
            >
              {selectedQuote.quote}
              <Typography variant='body1' sx={{ color: "text.secondary", mb: 1 }}>
                - {selectedQuote.author}
              </Typography>{" "}
              {/* Display the random quote */}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #FF8E53 30%, #123456 90%)",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Typography
            variant='body1'
            gutterBottom
            component='div'
            sx={{ textAlign: "center", fontWeight: "bold", mt: 4 }}
          >
            Watch List:
          </Typography>
          <WatchList />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfileDetails;
