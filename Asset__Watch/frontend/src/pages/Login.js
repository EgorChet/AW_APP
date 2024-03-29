import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Typography, Alert, Grid, Paper } from "@mui/material";
import CustomButton from "../components/CustomButton";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const authError = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateInputs = () => {
    if (!email && !password) {
      setErrorMessage("Email and password are required");
      return false;
    } else if (!email) {
      setErrorMessage("Email is required");
      return false;
    } else if (!password) {
      setErrorMessage("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous error messages
    setErrorMessage("");

    if (!validateInputs()) return; // Stop form submission if validation fails

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/dashboard"); // Navigate to Dashboard on successful login
      })
      .catch((error) => {
        // Handle specific error messages or generic ones based on the error response
        // Detailed logging for debugging
        console.error("Login failed:", error);
        console.log("Error object:", error);
        console.log("Error response:", error.response);
        console.log("Error response data:", error.response?.data);

        // Extracting specific error message
        const errorResponse = error?.msg || "Login failed. Please try again.";
        setErrorMessage(errorResponse);
      });
  };

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

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component='h1' variant='h5'>
          Login Page
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          >
            Login
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

export default LoginPage;