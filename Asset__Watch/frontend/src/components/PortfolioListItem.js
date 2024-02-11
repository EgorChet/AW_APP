import React from "react";
import PropTypes from "prop-types";
import { ListItem, Typography, Grid } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const PortfolioListItem = ({ stock }) => {
  const isGain = stock.current_gains_percentage >= 0;
  const gainsColor = isGain ? "green" : "red";
  const formattedPercentage = parseFloat(stock.current_gains_percentage).toFixed(2);
  const ProfitLossIcon = isGain ? ShowChartIcon : TrendingDownIcon;

  return (
    <ListItem
      divider
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        "&:hover": {
          backgroundColor: "action.hover", // Use theme's action.hover for a subtle hover effect
          cursor: "pointer", // Change cursor to pointer to indicate item is interactive
        },
      }}
    >
      <Grid container justifyContent='space-between' spacing={2}>
        <Grid item xs={3}>
          <Typography variant='body1' sx={{ fontWeight: "bold" }}>
            {stock.stock_symbol} - {stock.company_name}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant='body1' sx={{ fontWeight: "bold" }}>
            {stock.numberofshares}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant='body1' sx={{ fontWeight: "bold" }}>
            ${stock.average_price}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant='body1' sx={{ fontWeight: "bold" }}>
            ${stock.current_price}
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ProfitLossIcon sx={{ color: gainsColor, marginRight: 1 }} />
          <Typography variant='body1' sx={{ fontWeight: "bold", color: gainsColor }}>
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
    stock_symbol: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    numberofshares: PropTypes.number.isRequired,
    average_price: PropTypes.number.isRequired,
    current_price: PropTypes.number.isRequired,
  }).isRequired,
};

export default PortfolioListItem;

// import React from "react";
// import PropTypes from "prop-types";
// import { ListItem, Typography, Grid } from "@mui/material";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// const PortfolioListItem = ({ stock }) => {
//   const isGain = stock.current_gains_percentage >= 0;
//   const gainsColor = isGain ? "green" : "red";
//   const formattedPercentage = parseFloat(stock.current_gains_percentage).toFixed(2);
//   const ProfitLossIcon = isGain ? ShowChartIcon : TrendingDownIcon;

//   return (
//     <ListItem divider sx={{ display: "flex", alignItems: "center", width: "100%" }}>
//       <Grid container justifyContent='space-between' spacing={2}>
//         <Grid item xs={3}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             {stock.stock_symbol} - {stock.company_name}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             {stock.numberofshares}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             ${stock.average_price}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             ${stock.current_price}
//           </Typography>
//         </Grid>
//         <Grid item xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <ProfitLossIcon sx={{ color: gainsColor, marginRight: 1 }} />
//           <Typography variant='body1' sx={{ fontWeight: "bold", color: gainsColor }}>
//             {`${isGain ? "+" : ""}${formattedPercentage}%`}
//           </Typography>
//         </Grid>
//       </Grid>
//     </ListItem>
//   );
// };

// PortfolioListItem.propTypes = {
//   stock: PropTypes.shape({
//     current_gains_percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
//     stock_symbol: PropTypes.string.isRequired,
//     company_name: PropTypes.string.isRequired,
//     numberofshares: PropTypes.number.isRequired,
//     average_price: PropTypes.number.isRequired,
//     current_price: PropTypes.number.isRequired,
//   }).isRequired,
// };

// export default PortfolioListItem;
