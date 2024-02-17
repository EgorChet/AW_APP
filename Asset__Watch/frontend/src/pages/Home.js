import React from "react";
import { Typography, Container, Box, Grid, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import WorldIndices from "../components/WorldIndices"; // Assuming WorldIndices is a component
import SamplePortfolio from "../components/SamplePortfolio"; // Assuming you create a SamplePortfolio component
import CustomButton from "../components/CustomButton";

function HomePage() {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        {/* Hero Section */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant='h2' gutterBottom>
            Welcome to Asset-Watch
          </Typography>
          <Typography variant='h5'>
            Your one-stop solution for asset management and investment tracking.
          </Typography>
          <CustomButton
            variant='contained'
            color='primary'
            sx={{ mt: 3 }}
            component={RouterLink}
            to='/register'
          >
            Get Started
          </CustomButton>
        </Box>

        {/* Features Overview */}
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant='h6'>Real-Time Tracking</Typography>
              <Typography>
                Stay updated with the latest changes in your investment portfolio.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant='h6'>Global Market Indices</Typography>
              <Typography>
                Monitor major market indices from around the world at a glance.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant='h6'>Insightful Analytics</Typography>
              <Typography>
                Gain insights with detailed analytics and reports on your assets.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* World Indices and Sample Portfolio Section */}
        <Grid container spacing={4} sx={{ my: 4 }}>
          {/* World Indices */}
          <Grid item xs={12} md={6}>
            <Typography variant='h4' gutterBottom sx={{ mb: 6 }}>
              Follow Your Watch List
            </Typography>
            <WorldIndices />
          </Grid>

          {/* Sample Portfolio */}
          <Grid item xs={12} md={6}>
            <Typography variant='h4' gutterBottom>
              Track Your Portfolio
            </Typography>
            <SamplePortfolio /> {/* Implement this component to display a sample portfolio */}
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant='h5'>Ready to take control of your investments?</Typography>
          <CustomButton
            variant='contained'
            color='primary'
            sx={{ mt: 3 }}
            component={RouterLink}
            to='/register'
          >
            Sign Up Now
          </CustomButton>
        </Box>

        {/* Footer - Create a Footer component with additional info */}
        {/* <Footer /> */}
      </Box>
    </Container>
  );
}

export default HomePage;

