import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addStock } from "../features/stocks/stocksSlice";
import { TextField, Grid, Autocomplete, Snackbar, Alert, Container } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { format } from "date-fns";
import PropTypes from "prop-types";
import CustomButton from "./CustomButton";

const AddStockForm = ({ onStockAdded }) => {
  const [stockData, setStockData] = useState({
    stockSymbol: "",
    numberofshares: "",
    purchasePrice: "",
    purchase_date: null,
  });
  const [companyOptions, setCompanyOptions] = useState([]);
  // const [symbolOptions, setSymbolOptions] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const dispatch = useDispatch();

  // const handleSymbolInputChange = async (event, newInputValue) => {
  //   if (newInputValue.length < 2) return;
  //   try {
  //     const response = await axios.get(
  //       `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
  //     );
  //     const symbols = response.data.filter((symbol) =>
  //       symbol.name.toLowerCase().includes(newInputValue.toLowerCase())
  //     );
  //     setSymbolOptions(symbols.slice(0, 5));
  //   } catch (error) {
  //     console.error("Failed to fetch stock symbols:", error);
  //   }
  // };

  const handleSymbolInputChange = async (event, value) => {
    if (!value) return;
    try {
      // Assuming you're using IEX Cloud or a similar API
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
      );
      const filteredCompanies = response.data
        .filter((company) => company.name.toLowerCase().includes(value.toLowerCase()))
        .map((company) => ({
          label: company.name, // Displayed in the dropdown
          symbol: company.symbol, // Used when a company is selected
        }));
      setCompanyOptions(filteredCompanies);
    } catch (error) {
      console.error("Failed to fetch company symbols:", error);
    }
  };

  const handleChange = (e) => {
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    console.log("Selected Date: ", newValue);
    setStockData({ ...stockData, purchase_date: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Date before formatting: ", stockData.purchase_date);
    const formattedDate = stockData.purchase_date
      ? format(stockData.purchase_date, "yyyy-MM-dd")
      : null;
    console.log("Formatted Date: ", formattedDate);

    try {
      // Dispatch the action with the formatted date
      await dispatch(
        addStock({
          ...stockData,
          purchase_date: formattedDate,
          stockSymbol: stockData.stockSymbol.symbol || stockData.stockSymbol,
        })
      ).unwrap();

      setSnackbarMessage("Stock added to portfolio");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setStockData({
        stockSymbol: "",
        numberofshares: "",
        purchasePrice: "",
        purchase_date: null,
      });

      setTimeout(() => {
        if (onStockAdded) onStockAdded();
      }, 3000);
    } catch (error) {
      console.error("Failed to add stock:", error);
      setSnackbarMessage("Failed to add stock");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth='sm' sx={{ mt: 4 }}>
        <Grid
          container
          spacing={2}
          component='form'
          onSubmit={handleSubmit}
          noValidate
          autoComplete='off'
          sx={{
            "& .MuiTextField-root, & .MuiAutocomplete-root, & .MuiButtonBase-root": {
              // Applies to TextField, Autocomplete, and DatePicker input
              width: "100%", // Ensure full width
              // Specify other styles here for consistent sizing, e.g., height
            },
          }}
        >
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={companyOptions}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => {
                setStockData({ ...stockData, stockSymbol: newValue.symbol });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Company'
                  variant='outlined'
                  onChange={(event) => handleSymbolInputChange(event, event.target.value)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Shares'
              name='numberofshares'
              type='number'
              value={stockData.numberofshares}
              onChange={handleChange}
              variant='outlined'
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Purchase Price'
              name='purchasePrice'
              type='number'
              value={stockData.purchasePrice}
              onChange={handleChange}
              variant='outlined'
              required
            />
          </Grid>
          <Grid item xs={12}>
            <DesktopDatePicker
              label='Purchase Date'
              name='purchase_date'
              inputFormat='MM/dd/yyyy'
              value={stockData.purchase_date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} required />}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomButton
              type='submit'
              variant='contained'
              color='primary'
              sx={{
                maxWidth: 200,
                width: "100%",
                margin: "0 auto",
              }}
            >
              Add Stock
            </CustomButton>
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

AddStockForm.propTypes = {
  onStockAdded: PropTypes.func.isRequired,
};

export default AddStockForm;
