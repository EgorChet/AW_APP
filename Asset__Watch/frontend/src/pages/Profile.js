import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid, MenuItem, Box } from "@mui/material";

function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        name: user.name || "",
        surname: user.surname || "",
        age: user.age || "",
        gender: user.gender || "",
        facebook: user.facebook || "",
        instagram: user.instagram || "",
        linkedin: user.linkedin || "",
      });
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ ...profile, id: user.id }))
      .unwrap()
      .then(() => {
        alert("Profile updated successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        // Handle any errors here
        alert("Failed to update profile: " + error.message);
      });
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Profile Page
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                value={profile.email}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={profile.name}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Surname'
                name='surname'
                value={profile.surname}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Age'
                name='age'
                type='number'
                value={profile.age}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Gender'
                name='gender'
                value={profile.gender}
                onChange={handleChange}
                variant='outlined'
              >
                <MenuItem value=''>Select...</MenuItem>
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Facebook'
                name='facebook'
                value={profile.facebook}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Instagram'
                name='instagram'
                value={profile.instagram}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='LinkedIn'
                name='linkedin'
                value={profile.linkedin}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default ProfilePage;
