import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import ProfileUpdateModal from "./ProfileUpdateModal";
import { updateProfile, fetchUserProfile } from "../features/auth/authSlice";
import CustomButton from "../components/CustomButton";

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user); // Accessing currentUser directly from Redux store
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    surname: "",
    // name: "Please update",
    // surname: "your profile",
    age: "",
    gender: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    // Initialize the profile state with currentUser data if currentUser is not null
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  const handleOpenModal = () => {
    setProfileModalOpen(true);
  };

  const handleCloseModal = () => {
    setProfileModalOpen(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Current user information is missing. Please try again later.");
      return;
    }
    try {
      await dispatch(updateProfile({ ...profile, userId: currentUser.id })).unwrap();
      dispatch(fetchUserProfile(currentUser.id));
      alert("Profile updated successfully!");
      handleCloseModal();
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div>
      <Typography
        variant='h2'
        gutterBottom
        sx={{ textAlign: "center", mt: 10, fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" } }}
      >
        Welcome to your dashboard, {currentUser?.name || "please update your profile"}
      </Typography>
      {!currentUser?.name && (
        <CustomButton
          variant='contained'
          color='primary'
          onClick={handleOpenModal}
          sx={{ mt: 3, mb: 4 }}
        >
          Update Profile
        </CustomButton>
      )}

      <ProfileUpdateModal
        open={profileModalOpen}
        onClose={handleCloseModal}
        profile={profile}
        onProfileChange={handleProfileChange}
        onSave={handleSaveProfile}
      />
      <Typography
        variant='body1'
        sx={{ textAlign: "center", mb: 6, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
      >
        Here you can explore your profile, manage your stock portfolio, and track major World
        Indices.
      </Typography>
    </div>
  );
};

export default DashboardHeader;