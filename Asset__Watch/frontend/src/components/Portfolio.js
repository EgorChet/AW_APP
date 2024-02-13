// Portfolio.js
import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import PortfolioListItem from "./PortfolioListItem";
import PortfolioHeader from "./PortfolioHeader";
import PortfolioStats from "./PortfolioStats";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";

const Portfolio = ({ stocks }) => {
  const navigate = useNavigate();
  const goToPurchaseHistory = () => {
    navigate("/purchases"); // Change "/purchases" to your desired route
  };
  if (!stocks || stocks.length === 0) {
    // Check if stocks is undefined, null, or an empty array and handle accordingly
    return (
      <Typography textAlign='center' variant='h5'>
        No stocks available yet...
      </Typography>
    );
  }

  return (
    <>
      <PortfolioStats stocks={stocks} />
      <PortfolioHeader />
      {stocks.map((stock, index) => (
        <PortfolioListItem key={stock.id || `stock-${index}`} stock={stock} />
      ))}
      <CustomButton onClick={goToPurchaseHistory}>View Your Purchase History</CustomButton>
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
  ), // Not using .isRequired allows stocks to be undefined or null
};

export default Portfolio;
