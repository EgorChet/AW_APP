import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPortfolio, selectPortfolio } from "../features/stocks/stocksSlice";
import {
  fetchUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Grid, Box } from "@mui/material";
import Portfolio from "../components/Portfolio";
import ProfileDetails from "../components/ProfileDetails";
import AddStockForm from "../components/AddStocksForm";
import CustomButton from "../components/CustomButton";

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const stocks = useSelector(selectPortfolio);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAddStockForm, setShowAddStockForm] = useState(false);

  useEffect(() => {
    // This effect depends on the isAuthenticated state to make decisions.
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      // If authenticated, proceed to fetch user profile and portfolio
      if (currentUser?.id) {
        dispatch(fetchUserProfile(currentUser.id));
        dispatch(fetchPortfolio(currentUser.id));
      }
    }
  }, [isAuthenticated, currentUser?.id, dispatch, navigate]);

  if (!isAuthenticated) {
    return <Typography>Loading user information...</Typography>;
  }

  const handleAddStockClick = () => {
    setShowAddStockForm(true);
  };

  const onStockAdded = () => {
    setShowAddStockForm(false);
    dispatch(fetchPortfolio(currentUser.id)); // Refresh the portfolio
  };

  // Convert current_gains_percentage to a number
  const processedStocks = stocks.map((stock) => ({
    ...stock,
    current_gains_percentage: parseFloat(stock.current_gains_percentage),
  }));

  if (!currentUser) {
    return <Typography>Loading user information...</Typography>;
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      <Typography
        variant='h2'
        gutterBottom
        sx={{ textAlign: "center", mt: 10, fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" } }}
      >
        Welcome to your dashboard, {currentUser.name || "dear user"}
      </Typography>
      <Typography
        variant='h5'
        sx={{ textAlign: "center", mb: 6, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
      >
        Here you can explore your profile, manage your stock portfolio, and track major World
        Indices
      </Typography>
      <Grid container spacing={3} alignItems='stretch'>
        <Grid item xs={12}>
          <ProfileDetails user={currentUser} />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 10,
          p: 3,
          borderRadius: 2,
          bgcolor: "grey.100",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant='h6' gutterBottom sx={{ fontWeight: "medium" }}>
          Start Growing Your Portfolio!
        </Typography>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Start adding stocks to track your investments and watch your portfolio grow.
        </Typography>
        {!showAddStockForm && (
          <CustomButton variant='contained' onClick={handleAddStockClick}>
            Add Stock
          </CustomButton>
        )}
      </Box>

      {showAddStockForm && <AddStockForm onStockAdded={onStockAdded} />}

      <Box sx={{ mt: 2, bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
        <Portfolio stocks={processedStocks} />
      </Box>
    </Container>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchPortfolio, selectPortfolio } from "../features/stocks/stocksSlice";
// import { fetchUserProfile, selectCurrentUser } from "../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { Typography, Container, Grid, Box } from "@mui/material";
// import Portfolio from "../components/Portfolio";
// import ProfileDetails from "../components/ProfileDetails";
// import AddStockForm from "../components/AddStocksForm";
// import CustomButton from "../components/CustomButton";

// const Dashboard = () => {
//   const currentUser = useSelector(selectCurrentUser);
//   const stocks = useSelector(selectPortfolio);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showAddStockForm, setShowAddStockForm] = useState(false);

//   useEffect(() => {
//     if (currentUser?.id) {
//       dispatch(fetchUserProfile(currentUser.id));
//       dispatch(fetchPortfolio(currentUser.id));
//     } else {
//       navigate("/login");
//     }
//   }, [currentUser?.id, dispatch, navigate]);

//   const handleAddStockClick = () => {
//     setShowAddStockForm(true);
//   };

//   const onStockAdded = () => {
//     setShowAddStockForm(false);
//     dispatch(fetchPortfolio(currentUser.id)); // Refresh the portfolio
//   };

//   // Convert current_gains_percentage to a number
//   const processedStocks = stocks.map((stock) => ({
//     ...stock,
//     current_gains_percentage: parseFloat(stock.current_gains_percentage),
//   }));

//   if (!currentUser) {
//     return <Typography>Loading user information...</Typography>;
//   }

//   return (
//     <Container maxWidth='xl' sx={{ mt: 4 }}>
//       <Typography variant='h2' gutterBottom sx={{ textAlign: "center", mt: 10 }}>
//         Welcome to your dashboard, {currentUser.name || "dear user"}
//       </Typography>
//       <Typography variant='h5' sx={{ textAlign: "center", mb: 6 }}>
//         Here you can explore your profile manage your stock portfolio and track major World Indices
//       </Typography>
//       <Grid container spacing={3} alignItems='stretch'>
//         <Grid item xs={12} md={12}>
//           <ProfileDetails user={currentUser} />
//         </Grid>
//       </Grid>

//       <Box
//         sx={{
//           mt: 10,
//           p: 3,
//           borderRadius: 2,
//           bgcolor: "grey.100",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant='h6' gutterBottom sx={{ fontWeight: "medium" }}>
//           Start Growing Your Portfolio!
//         </Typography>
//         <Typography variant='body1' sx={{ mb: 2 }}>
//           Start adding stocks to track your investments and watch your portfolio grow.
//         </Typography>
//         {!showAddStockForm && (
//           <CustomButton variant='contained' onClick={handleAddStockClick}>
//             Add Stock
//           </CustomButton>
//         )}
//       </Box>

//       {showAddStockForm && <AddStockForm onStockAdded={onStockAdded} />}

//       <Box sx={{ mt: 2, bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
//         <Portfolio stocks={processedStocks} />
//       </Box>
//     </Container>
//   );
// };

// export default Dashboard;

// // Dashboard.js
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchPortfolio, selectPortfolio } from "../features/stocks/stocksSlice";
// import { fetchUserProfile, selectCurrentUser } from "../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { Typography, Container, Box, Button } from "@mui/material";
// import Portfolio from "../components/Portfolio";
// import ProfileDetails from "../components/ProfileDetails";
// import AddStockForm from "../components/AddStocksForm";

// const Dashboard = () => {
//   const currentUser = useSelector(selectCurrentUser);
//   const stocks = useSelector(selectPortfolio); // Use the selector to get the stocks data
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showAddStockForm, setShowAddStockForm] = useState(false);

//   useEffect(() => {
//     if (currentUser?.id) {
//       dispatch(fetchUserProfile(currentUser.id));
//       dispatch(fetchPortfolio(currentUser.id));
//     } else {
//       navigate("/login");
//     }
//   }, [currentUser?.id, dispatch, navigate]);

//   const handleAddStockClick = () => {
//     setShowAddStockForm(true);
//   };

//   const onStockAdded = () => {
//     setShowAddStockForm(false);
//     dispatch(fetchPortfolio(currentUser.id)); // Refresh the portfolio
//   };

//   if (!currentUser) {
//     return <Typography>Loading user information...</Typography>;
//   }

//   return (
//     <Container maxWidth='xl' sx={{ mt: 4 }}>
//       <Typography variant='h4' gutterBottom sx={{ fontWeight: "bold" }}>
//         Welcome to your dashboard, {currentUser.name || "dear user"}
//       </Typography>

//       <ProfileDetails user={currentUser} sx={{ mb: 5 }} />

// <Box
//   sx={{
//     mt: 10,
//     p: 3,
//     borderRadius: 2,
//     bgcolor: "grey.100",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   }}
// >
//   <Typography variant='h6' gutterBottom sx={{ fontWeight: "medium" }}>
//     Start Growing Your Portfolio!
//   </Typography>
//   <Typography variant='body1' sx={{ mb: 2 }}>
//     Start adding stocks to track your investments and watch your portfolio grow.
//   </Typography>
//   {!showAddStockForm && (
//     <Button variant='contained' onClick={handleAddStockClick}>
//       Add Stock
//     </Button>
//   )}
// </Box>

// {showAddStockForm && <AddStockForm onStockAdded={onStockAdded} />}

//       <Box sx={{ mt: 6, bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
//         <Portfolio stocks={stocks} />
//       </Box>
//     </Container>
//   );
// };

// export default Dashboard;
