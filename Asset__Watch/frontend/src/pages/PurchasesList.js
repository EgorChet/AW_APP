import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPortfolio } from "../features/stocks/stocksSlice";
import {
  CircularProgress,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { selectCurrentUser } from "../features/auth/authSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../config/axiosConfig";
import EditPurchaseModal from "../components/EditPurchaseModal";
import { format } from "date-fns";

const PurchasesList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (currentUser?.id) {
      setLoading(true);
      axiosInstance
        .get(`/api/purchases/${currentUser.id}`)
        .then((response) => {
          setPurchases(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch purchases:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [currentUser?.id]);

  const handleEditOpen = (purchase) => {
    setCurrentPurchase(purchase);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedPurchase) => {
    try {
      await axiosInstance.put(`/api/purchase/${updatedPurchase.id}`, updatedPurchase);
      setEditModalOpen(false);
      setCurrentPurchase(null);
      dispatch(fetchPortfolio(currentUser?.id)); // Refresh the portfolio using currentUser?.id
      // Refresh purchases to reflect the update
      const response = await axiosInstance.get(`/api/purchases/${currentUser?.id}`);
      setPurchases(response.data);
    } catch (error) {
      console.error("Failed to update purchase:", error);
      alert("Failed to update purchase");
    }
  };

  const handleDelete = async (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await axiosInstance.delete(`/api/purchases/${purchaseId}`);
        const updatedPurchases = purchases.filter((purchase) => purchase.id !== purchaseId);
        setPurchases(updatedPurchases);
        dispatch(fetchPortfolio(currentUser?.id)); // Use currentUser?.id here as well
      } catch (error) {
        console.error("Failed to delete purchase:", error);
        alert("Failed to delete purchase");
      }
    }
  };

  if (loading) {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        Your Purchase History {currentUser.name}
      </Typography>
      <Paper elevation={3} sx={{ p: 2, my: 2 }}>
        <List>
          {purchases.map((purchase) => (
            <ListItem key={purchase.id} divider sx={{ py: theme.spacing(2) }}>
              <Grid
                container
                direction={isMobile ? "column" : "row"}
                justifyContent='space-between'
                alignItems={isMobile ? "flex-start" : "center"}
                spacing={2}
              >
                <Grid item xs={12} sm={isMobile ? 12 : 10}>
                  <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Stock: {purchase.stock_symbol} - Quantity: {purchase.number_of_stocks_purchased}{" "}
                    - Price: ${purchase.purchase_price} - Date:{" "}
                    {format(new Date(purchase.purchase_date), "MM/dd/yyyy")}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  sx={{
                    display: "flex",
                    justifyContent: isMobile ? "space-between" : "flex-end",
                    pt: isMobile ? 1 : 0,
                  }}
                >
                  <IconButton onClick={() => handleEditOpen(purchase)} size='large'>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(purchase.id)}
                    size='large'
                    sx={{ ml: isMobile ? 0 : 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
      {editModalOpen && currentPurchase && (
        <EditPurchaseModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          purchase={currentPurchase}
          onSave={handleEditSave}
        />
      )}
    </Container>
  );
};

export default PurchasesList;
