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

// import React from "react";
// import { Typography, Container, Box, Button } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom"; // Renamed to avoid conflict with MUI Link

// function HomePage() {
//   return (
//     <Container component='main' maxWidth='sm'>
//       <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <Typography component='h1' variant='h2' gutterBottom>
//           Home Page
//         </Typography>
//         <Typography variant='body1' gutterBottom>
//           Welcome to our application!
//         </Typography>
//         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//           <Button variant='contained' color='primary' sx={{ mt: 3 }}>
//             Learn More
//           </Button>
//           <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 3 }}>
//             <Button
//               variant='contained'
//               color='primary'
//               component={RouterLink}
//               to='/login'
//               sx={{ width: "48%" }}
//             >
//               Login
//             </Button>
//             <Button
//               variant='contained'
//               color='primary'
//               component={RouterLink}
//               to='/register'
//               sx={{ width: "48%" }}
//             >
//               Register
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// export default HomePage;

// // src/pages/HomePage.js
// import React from "react";
// import { Typography, Container, Box, Button } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom"; // Renamed to avoid conflict with MUI Link

// function HomePage() {
//   return (
//     <Container component='main' maxWidth='sm'>
//       <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <Typography component='h1' variant='h2' gutterBottom>
//           Home Page
//         </Typography>
//         <Typography variant='body1' gutterBottom>
//           Welcome to our application!
//         </Typography>
//         <Button variant='contained' color='primary' sx={{ mt: 3 }}>
//           Learn More
//         </Button>
//         <Button
//           variant='contained'
//           color='primary'
//           sx={{ mt: 3 }}
//           component={RouterLink}
//           to='/login'
//         >
//           Login
//         </Button>
//         <Button
//           variant='contained'
//           color='primary'
//           sx={{ mt: 3 }}
//           component={RouterLink}
//           to='/register'
//         >
//           Register
//         </Button>
//       </Box>
//     </Container>
//   );
// }

// export default HomePage;

// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../App";

// const Home = (props) => {
//   const [users, setUsers] = useState([]);
//   const { token } = useContext(AuthContext);

//   const BaseUrl = process.env.REACT_APP_BASE_URL;

//   //   console.log(token.token); this is our token from headers we could not get it from cookies

//   useEffect(() => {
//     getusers();
//   }, []);

//   const getusers = async () => {
//     const url = `${BaseUrl}/users/`;
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           "x-access-token": token.token,
//         },
//       });
//       if (response.status === 200) setUsers(response.data);
//     } catch (error) {}
//   };

//   return (
//     <>
//       <h1> Home Page</h1>
//       {users.map((user) => {
//         return <div key={user.id}>{user.email}</div>;
//       })}
//     </>
//   );
// };

// export default Home;
