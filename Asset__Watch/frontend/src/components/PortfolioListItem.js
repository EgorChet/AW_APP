import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import InfoIcon from "@mui/icons-material/Info"; // For mobile click to reveal full name

const PortfolioListItem = ({ stock }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isGain = stock.current_gains_percentage >= 0;
  const formattedPercentage = parseFloat(stock.current_gains_percentage).toFixed(2);
  const gainsColor = isGain ? "green" : "red";

  const detailLabelStyle = {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
    fontWeight: "bold",
    marginBottom: theme.spacing(0.5),
  };

  const detailValueStyle = {
    fontSize: isMobile ? "1rem" : "1.1rem",
    fontWeight: "bold",
  };

  // Mobile-friendly text display
  const MobileTextDisplay = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {children}
      <IconButton size='small' onClick={() => alert(stock.company_name)}>
        <InfoIcon fontSize='inherit' />
      </IconButton>
    </div>
  );

  MobileTextDisplay.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ListItem
      divider
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: theme.spacing(2) }}
    >
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        justifyContent='space-between'
        spacing={2}
      >
        <Grid item xs={12} md={2} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Company Name</Typography>
          {isMobile ? (
            <MobileTextDisplay>
              <Typography
                sx={{
                  ...detailValueStyle,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {stock.stock_symbol}
              </Typography>
            </MobileTextDisplay>
          ) : (
            <Tooltip title={stock.company_name}>
              <Typography
                sx={{
                  ...detailValueStyle,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {stock.stock_symbol} - {stock.company_name}
              </Typography>
            </Tooltip>
          )}
        </Grid>
        {/* Repeat for other details */}
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Number Of Shares</Typography>
          <Typography sx={detailValueStyle}>{stock.numberofshares}</Typography>
        </Grid>
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Current Value</Typography>
          <Typography sx={detailValueStyle}>
            ${(stock.current_price * stock.numberofshares).toFixed(0)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Avg Price</Typography>
          <Typography sx={detailValueStyle}>{stock.average_price}</Typography>
        </Grid>
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Current Price</Typography>
          <Typography sx={detailValueStyle}>{stock.current_price}</Typography>
        </Grid>
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>
            {stock.current_gains_percentage >= 0 ? "Profit $" : "Loss $"}
          </Typography>
          <Typography
            sx={{
              ...detailValueStyle,
              color: stock.current_gains_percentage >= 0 ? "green" : "red",
            }}
          >
            $
            {(
              stock.average_price * stock.numberofshares -
              stock.current_price * stock.numberofshares
            ).toFixed(0)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1.5} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>
            {stock.current_gains_percentage >= 0 ? "Profit %" : "Loss %"}
          </Typography>
          <Typography sx={{ ...detailValueStyle, color: gainsColor }}>
            {isGain ? <TrendingUpIcon /> : <TrendingDownIcon />}
            {`${isGain ? "+" : ""}${formattedPercentage}%`}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

PortfolioListItem.propTypes = {
  stock: PropTypes.shape({
    current_gains_percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    stock_symbol: PropTypes.string,
    company_name: PropTypes.string.isRequired,
    numberofshares: PropTypes.number.isRequired,
    average_price: PropTypes.number.isRequired,
    current_price: PropTypes.number.isRequired,
  }).isRequired,
};

export default PortfolioListItem;