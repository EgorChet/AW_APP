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
import DashboardHeader from "../components/DashboardHeader";

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
      <DashboardHeader />
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
        <Typography variant='body1' gutterBottom sx={{ fontWeight: "medium" }}>
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