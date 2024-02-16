import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatarAction, fetchUserProfile } from "../features/auth/authSlice"; // Make sure the path is correct
import { Grid, Avatar, Box } from "@mui/material";
import CustomButton from "./CustomButton";
import PropTypes from "prop-types"; // Import PropTypes

const UserAvatarUpdate = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || "");

  const avatars = Array.from(
    { length: 16 },
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
