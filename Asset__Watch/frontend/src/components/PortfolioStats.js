import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Paper, Grid, Tooltip } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const StatBox = ({ title, value, icon, color, hoverColor }) => (
  <Tooltip title={title}>
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        "&:hover": {
          backgroundColor: hoverColor,
          opacity: [0.9, 0.8, 0.7],
        },
        transition: "0.3s",
        boxShadow: 3,
      }}
    >
      {icon}
      <Typography
        variant='h5'
        component='div'
        sx={{ mt: 2, color: "white", fontWeight: "bold", textAlign: "center" }}
      >
        {title}
      </Typography>
      <Typography variant='h6' sx={{ color: "white" }}>
        {value}
      </Typography>
    </Paper>
  </Tooltip>
);

StatBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
};

StatBox.defaultProps = {
  color: "text.primary",
  hoverColor: "primary.main",
};

const PortfolioStats = ({ stocks }) => {
  const totalInvested = stocks.reduce(
    (total, stock) => total + stock.numberofshares * stock.average_price,
    0
  );
  const currentPortfolioValue = stocks.reduce(
    (total, stock) => total + stock.numberofshares * stock.current_price,
    0
  );
  const gainLoss = currentPortfolioValue - totalInvested;
  const percentageGainLoss = ((gainLoss / totalInvested) * 100).toFixed(2);

  return (
    <Box sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StatBox
            title='Money Invested'
            value={`$${totalInvested.toFixed(2)}`}
            icon={<AccountBalanceWalletIcon sx={{ color: "white" }} />}
            color='info.main'
          />
        </Grid>
        <Grid item xs={4}>
          <StatBox
            title='Current Value'
            value={`$${currentPortfolioValue.toFixed(2)}`}
            icon={<AccountBalanceIcon sx={{ color: "white" }} />}
            color='success.main'
          />
        </Grid>
        <Grid item xs={4}>
          <StatBox
            title={gainLoss >= 0 ? "Your Total Profit" : "Your Total Loss"}
            value={`${gainLoss >= 0 ? "+" : ""}${percentageGainLoss}%`}
            icon={
              gainLoss >= 0 ? (
                <TrendingUpIcon sx={{ color: "white" }} />
              ) : (
                <TrendingDownIcon sx={{ color: "white" }} />
              )
            }
            color={gainLoss >= 0 ? "success.dark" : "error.main"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

PortfolioStats.propTypes = {
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      numberofshares: PropTypes.number.isRequired,
      average_price: PropTypes.number.isRequired,
      current_price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PortfolioStats;
