import React, { useState, useEffect } from "react";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setCompanyOptions(
          response.data.map((company) => ({
            label: `${company.symbol} - ${company.name}`,
            symbol: company.symbol,
          }))
        );
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setStockData({ ...stockData, purchase_date: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = stockData.purchase_date
      ? format(stockData.purchase_date, "yyyy-MM-dd")
      : null;

    try {
      await dispatch(
        addStock({
          ...stockData,
          purchase_date: formattedDate,
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

      if (onStockAdded) onStockAdded();
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
        <form onSubmit={handleSubmit} noValidate autoComplete='off'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={companyOptions}
                getOptionLabel={(option) => option.label}
                onInputChange={(event, newValue) => {
                  const selectedCompany = companyOptions.find(
                    (option) => option.label === newValue
                  );
                  setStockData({
                    ...stockData,
                    stockSymbol: selectedCompany ? selectedCompany.symbol : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label='Stock Symbol' variant='outlined' />
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
        </form>
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
