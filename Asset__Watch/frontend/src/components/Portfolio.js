import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid } from "@mui/material";
import PortfolioListItem from "./PortfolioListItem";
import PortfolioStats from "./PortfolioStats";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const Portfolio = ({ stocks }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const goToPurchaseHistory = () => {
    navigate("/purchases");
  };

  if (!stocks || stocks.length === 0) {
    return (
      <Typography textAlign='center' variant='h5'>
        No stocks available yet...
      </Typography>
    );
  }

  return (
    <>
      <PortfolioStats stocks={stocks} />
      <Grid container spacing={2}>
        {stocks.map((stock, index) => (
          // Adjust the Grid item props based on the screen size
          // On mobile, use 6 to create two items per row, and 12 for a single item per row on larger screens
          <Grid item xs={isMobile ? 6 : 12} key={stock.id || `stock-${index}`}>
            <PortfolioListItem stock={stock} />
          </Grid>
        ))}
      </Grid>
      <CustomButton sx={{ mt: 5 }} onClick={goToPurchaseHistory}>
        View Your Purchase History
      </CustomButton>
    </>
  );
};

Portfolio.propTypes = {
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      current_gains_percentage: PropTypes.number,
      stock_symbol: PropTypes.string,
      company_name: PropTypes.string,
      numberofshares: PropTypes.number,
      average_price: PropTypes.number,
    })
  ),
};

export default Portfolio;
