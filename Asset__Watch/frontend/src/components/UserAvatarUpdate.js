import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatarAction, fetchUserProfile } from "../features/auth/authSlice"; // Make sure the path is correct
import { Grid, Avatar, Box } from "@mui/material";
import CustomButton from "./CustomButton";
import PropTypes from "prop-types"; // Import PropTypes

const UserAvatarUpdate = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || "");
  // State to hold the number of avatars
  const [avatarCount, setAvatarCount] = useState(getAvatarCount());

  // Function to determine the avatar count based on window width
  function getAvatarCount() {
    return window.innerWidth < 600 ? 15 : 36;
  }

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setAvatarCount(getAvatarCount());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate a list of avatar URLs
  const avatars = Array.from(
    { length: avatarCount },
    (_, index) => `https://robohash.org/${index}?set=set5`
  );

  const handleAvatarSelect = (url) => {
    setSelectedAvatar(url);
  };

  const handleSaveAvatar = async () => {
    try {
      await dispatch(updateAvatarAction({ avatarUrl: selectedAvatar })).unwrap();
      await dispatch(fetchUserProfile(user.id)).unwrap();

      if (onClose) onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update avatar:", error);
      // Optionally handle the error, e.g., show an error message
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {avatars.map((url, index) => (
          <Grid item xs={4} sm={2} key={index}>
            <Avatar
              src={url}
              alt={`Avatar ${index}`}
              sx={{
                width: 56,
                height: 56,
                cursor: "pointer",
                border: selectedAvatar === url ? "2px solid blue" : "none",
              }}
              onClick={() => handleAvatarSelect(url)}
            />
          </Grid>
        ))}
      </Grid>
      <CustomButton fullWidth sx={{ mt: 2 }} onClick={handleSaveAvatar} disabled={!selectedAvatar}>
        Save Avatar
      </CustomButton>
    </Box>
  );
};

// Define propTypes for UserAvatarUpdate
UserAvatarUpdate.propTypes = {
  onClose: PropTypes.func.isRequired, // onClose is required and must be a function
};

export default UserAvatarUpdate;
