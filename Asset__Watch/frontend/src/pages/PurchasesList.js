import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPortfolio } from "../features/stocks/stocksSlice";
import { format } from "date-fns";
import {
  CircularProgress,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { selectCurrentUser } from "../features/auth/authSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../config/axiosConfig";
import EditPurchaseModal from "../components/EditPurchaseModal"; // Assuming this is the correct path

const PurchasesList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = currentUser?.id; // Updated to directly use currentUser's ID
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`/api/purchases/${userId}`);
          setPurchases(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch purchases:", error);
          setLoading(false);
        }
      }
    };
    fetchPurchases();
  }, [userId]);

  const handleEditOpen = (purchase) => {
    setCurrentPurchase(purchase);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedPurchase) => {
    try {
      await axiosInstance.put(`/api/purchase/${updatedPurchase.id}`, {
        number_of_stocks_purchased: updatedPurchase.number_of_stocks_purchased,
        purchase_price: updatedPurchase.purchase_price,
        purchase_date: updatedPurchase.purchase_date, // Ensure format is compatible with your backend
      });
      setEditModalOpen(false);
      setCurrentPurchase(null);
      dispatch(fetchPortfolio(userId)); // Refresh the portfolio
      // Refresh purchases to reflect the update
      const response = await axiosInstance.get(`/api/purchases/${userId}`);
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
        dispatch(fetchPortfolio(userId));
      } catch (error) {
        console.error("Failed to delete purchase:", error);
        alert("Failed to delete purchase");
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Purchase History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {purchases.map((purchase) => (
              <ListItem
                key={purchase.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge='end'
                      aria-label='edit'
                      onClick={() => handleEditOpen(purchase)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge='end'
                      aria-label='delete'
                      onClick={() => handleDelete(purchase.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`Stock: ${purchase.stock_symbol}`}
                  secondary={`Quantity: ${purchase.number_of_stocks_purchased}, Price: $${
                    purchase.purchase_price
                  }, Purchase Date: ${format(new Date(purchase.purchase_date), "MM/dd/yyyy")}`}
                />
              </ListItem>
            ))}
          </List>
          {editModalOpen && currentPurchase && (
            <EditPurchaseModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              purchase={currentPurchase}
              onSave={handleEditSave}
            />
          )}
        </Paper>
      )}
    </Container>
  );
};

export default PurchasesList;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchPortfolio } from "../features/stocks/stocksSlice";
// import { format } from "date-fns";
// import {
//   CircularProgress,
//   Container,
//   Paper,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Box,
// } from "@mui/material";
// import { selectCurrentUser } from "../features/auth/authSlice";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axiosInstance from "../config/axiosConfig";
// import EditPurchaseModal from "../components/EditPurchaseModal";

// const PurchasesList = () => {
//   const currentUser = useSelector(selectCurrentUser);
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const userId = useSelector((state) => state.auth.user.id);
//   const dispatch = useDispatch();
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [currentPurchase, setCurrentPurchase] = useState(null);

//   const handleEditOpen = (purchase) => {
//     setCurrentPurchase(purchase);
//     setEditModalOpen(true);
//   };

//   const handleEditSave = async (formData) => {
//     // Use currentPurchase.id directly
//     try {
//       await axiosInstance.put(`/api/purchases/${currentPurchase.id}`, formData);
//       // Consider refetching purchases list to reflect changes
//       const updatedPurchases = await fetchPurchases(); // Assuming fetchPurchases returns the updated list
//       setPurchases(updatedPurchases);
//       dispatch(fetchPortfolio(userId));
//       setEditModalOpen(false); // Close modal after save
//     } catch (error) {
//       console.error("Failed to update purchase:", error);
//       alert("Failed to update purchase");
//     }
//   };

//   // const handleEditSave = async (purchaseId, formData) => {
//   //   // Implement the save functionality here, similar to your delete function but with PUT/POST request to update
//   //   try {
//   //     await axiosInstance.put(`/api/purchases/${purchaseId}`, formData);
//   //     // Update local state or refetch purchases list to reflect changes
//   //     // You may also want to refetch or update the portfolio data here
//   //     dispatch(fetchPortfolio(userId));
//   //   } catch (error) {
//   //     console.error("Failed to update purchase:", error);
//   //     alert("Failed to update purchase");
//   //   }
//   // };

//   useEffect(() => {
//     const fetchPurchases = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(`/api/purchases/${userId}`);
//         setPurchases(response.data);
//       } catch (error) {
//         console.error("Failed to fetch purchases:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchPurchases();
//     }
//   }, [userId]);

//   const handleDelete = async (purchaseId) => {
//     if (window.confirm("Are you sure you want to delete this purchase?")) {
//       try {
//         await axiosInstance.delete(`/api/purchases/${purchaseId}`);
//         const updatedPurchases = purchases.filter((purchase) => purchase.id !== purchaseId);
//         setPurchases(updatedPurchases);
//         dispatch(fetchPortfolio(userId));
//       } catch (error) {
//         alert("Failed to delete purchase");
//       }
//     }
//   };

//   return (
//     <Container maxWidth='md' sx={{ mt: 4 }}>
//       <Typography variant='h4' gutterBottom>
//         Here Is Your Purchase History {currentUser.name}
//       </Typography>
//       {loading ? (
//         <Box display='flex' justifyContent='center'>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Paper elevation={3} sx={{ p: 2 }}>
//           <List>
//             {purchases.length > 0 ? (
//               purchases.map((purchase) => (
//                 <ListItem
//                   key={purchase.id}
//                   secondaryAction={
//                     <>
//                       <IconButton
//                         edge='end'
//                         aria-label='edit'
//                         onClick={() => handleEditOpen(purchase)}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         edge='end'
//                         aria-label='delete'
//                         onClick={() => handleDelete(purchase.id)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </>
//                   }
//                 >
//                   <ListItemText
//                     primary={`Stock: ${purchase.stock_symbol}`}
//                     secondary={`Quantity: ${purchase.number_of_stocks_purchased}, Price: $${
//                       purchase.purchase_price
//                     }, Purchase Date: ${format(new Date(purchase.purchase_date), "MM/dd/yyyy")}`}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <Typography variant='subtitle1'>No purchases found.</Typography>
//             )}
//           </List>
//           {currentPurchase && (
//             <EditPurchaseModal
//               open={editModalOpen}
//               onClose={() => setEditModalOpen(false)}
//               purchase={currentPurchase}
//               onSave={handleEditSave}
//             />
//           )}
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default PurchasesList;
