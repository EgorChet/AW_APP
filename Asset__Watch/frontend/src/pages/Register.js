import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import {
  Container,
  Box,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendErrors, setBackendErrors] = useState({});
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // This effect now only serves to clear backend errors upon user input change.
    return () => setBackendErrors({});
  }, [email, password]);

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern

    if (!email.trim()) {
      errors.email = "Please enter an email address.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Please enter a password.";
    }

    setBackendErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors({}); // Reset backend errors on new submission attempt
    if (!validateForm()) return;

    dispatch(registerUser({ email, password }))
      .unwrap()
      .then(() => navigate("/login"))
      .catch((error) => {
        // Adjust this based on the actual error structure from your backend
        setBackendErrors({
          general: error.message || "Registration failed. Please try again later.",
        });
      });
  };

  // Clear errors when either email or password fields are modified
  useEffect(() => {
    if (email || password) {
      setBackendErrors({});
    }
  }, [email, password]);

  return (
    <Container component='main'>
      {/* Hero Section */}
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant='h2' gutterBottom>
          Welcome to Asset-Watch
        </Typography>
        <Typography variant='h5'>
          Your one-stop solution for asset management and investment tracking.
        </Typography>
      </Box>

      {/* Registration Form */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {authStatus === "failed" && backendErrors.general && (
          <Alert severity='error'>{backendErrors.general}</Alert>
        )}
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            type='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!backendErrors.email}
            helperText={backendErrors.email}
            sx={{
              "& .MuiInputBase-input": {
                color: "black", // Set the color you want for the text
              },
            }}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!backendErrors.password}
            helperText={backendErrors.password}
            sx={{
              "& .MuiInputBase-input": {
                color: "black", // Set the color you want for the text
              },
            }}
          />
          <CustomButton
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 3, mb: 2, width: "50%", mx: "auto", display: "block" }}
            disabled={authStatus === "loading"}
          >
            {authStatus === "loading" ? <CircularProgress size={24} color='inherit' /> : "Register"}
          </CustomButton>
        </Box>
      </Box>

      {/* Features Overview */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ my: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Real-Time Tracking</Typography>
              <Typography>
                Stay updated with the latest changes in your investment portfolio.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Global Market Indices</Typography>
              <Typography>
                Monitor major market indices from around the world at a glance.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Insightful Analytics</Typography>
              <Typography>
                Gain insights with detailed analytics and reports on your assets.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
    </Container>
  );
}

export default RegisterPage;

