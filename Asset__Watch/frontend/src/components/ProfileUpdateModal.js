import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";

const ProfileUpdateModal = ({ open, onClose, profile, onProfileChange, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Update Profile</DialogTitle>
      <form onSubmit={onSave}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email'
                type='email'
                name='email'
                variant='outlined'
                value={profile.email}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                variant='outlined'
                value={profile.name}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Surname'
                name='surname'
                variant='outlined'
                value={profile.surname}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Age'
                name='age'
                type='number'
                variant='outlined'
                value={profile.age}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Gender'
                name='gender'
                value={profile.gender}
                onChange={onProfileChange}
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
                variant='outlined'
                value={profile.facebook}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Instagram'
                name='instagram'
                variant='outlined'
                value={profile.instagram}
                onChange={onProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='LinkedIn'
                name='linkedin'
                variant='outlined'
                value={profile.linkedin}
                onChange={onProfileChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' variant='contained' color='primary'>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ProfileUpdateModal.defaultProps = {
  profile: {
    email: "",
    name: "",
    surname: "",
    age: "",
    gender: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  },
};

ProfileUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    gender: PropTypes.string.isRequired,
    facebook: PropTypes.string,
    instagram: PropTypes.string,
    linkedin: PropTypes.string,
  }).isRequired,
  onProfileChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProfileUpdateModal;
