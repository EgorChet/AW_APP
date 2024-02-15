// AddStockForm.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addStock } from "../features/stocks/stocksSlice";
import { Grid, TextField, Snackbar, Alert, Container, Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import PropTypes from "prop-types";
import CompanySearch from "./CompanySearch";

const AddStockForm = ({ onStockAdded }) => {
  const [stockData, setStockData] = useState({
    stockSymbol: "",
    numberofshares: "",
    purchasePrice: "",
    purchase_date: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData({ ...stockData, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setStockData({ ...stockData, purchase_date: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = format(stockData.purchase_date, "yyyy-MM-dd");

    try {
      await dispatch(
        addStock({
          ...stockData,
          purchase_date: formattedDate,
        })
      ).unwrap();
      setSnackbarMessage("Stock successfully added!");
      setOpenSnackbar(true);
      setStockData({ stockSymbol: "", numberofshares: "", purchasePrice: "", purchase_date: "" });
      if (onStockAdded) onStockAdded();
    } catch (error) {
      console.error("Failed to add stock:", error);
      setSnackbarMessage("Failed to add stock.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth='sm' sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit} noValidate autoComplete='off'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CompanySearch
                onCompanySelect={(company) =>
                  setStockData({ ...stockData, stockSymbol: company?.symbol || "" })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Number of Shares'
                type='number'
                name='numberofshares'
                value={stockData.numberofshares}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Purchase Price ($)'
                type='number'
                name='purchasePrice'
                value={stockData.purchasePrice}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <DesktopDatePicker
                label='Purchase Date'
                inputFormat='MM/dd/yyyy'
                value={stockData.purchase_date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Button type='submit' variant='contained' color='primary'>
                Add Stock
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

AddStockForm.propTypes = {
  onStockAdded: PropTypes.func,
};

export default AddStockForm;
