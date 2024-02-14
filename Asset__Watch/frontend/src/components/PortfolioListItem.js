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
                {stock.stock_symbol} {/* {stock.stock_symbol} - {stock.company_name} */}
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
        <Grid item xs={12} md={2} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Number Of Shares</Typography>
          <Typography sx={detailValueStyle}>{stock.numberofshares}</Typography>
        </Grid>
        {/* Continue for Avg Price, Current Price, and Profit/Loss with similar structure */}
        <Grid item xs={12} md={2} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Avg Price</Typography>
          <Typography sx={detailValueStyle}>{stock.average_price}</Typography>
        </Grid>
        <Grid item xs={12} md={2} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Current Price</Typography>
          <Typography sx={detailValueStyle}>{stock.current_price}</Typography>
        </Grid>
        <Grid item xs={12} md={2} sx={{ textAlign: isMobile ? "left" : "center" }}>
          <Typography sx={detailLabelStyle}>Profit/Loss</Typography>
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
// import { ListItem, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// const PortfolioListItem = ({ stock }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isGain = stock.current_gains_percentage >= 0;
//   const gainsColor = isGain ? "green" : "red";
//   const formattedPercentage = parseFloat(stock.current_gains_percentage).toFixed(2);
//   const ProfitLossIcon = isGain ? ShowChartIcon : TrendingDownIcon;

//   return (
//     <ListItem
//       divider
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: isMobile ? theme.spacing(1) : theme.spacing(3),
//         "&:hover": {
//           backgroundColor: "action.hover",
//         },
//         width: "100%",
//       }}
//     >
//       <Grid container justifyContent='space-between' alignItems='center' spacing={2}>
//         <Grid item xs={12} sm={3}>
//           <Typography
//             variant='body1'
//             sx={{ fontWeight: "bold", textAlign: isMobile ? "center" : "left" }}
//           >
//             {stock.stock_symbol} - {stock.company_name}
//           </Typography>
//         </Grid>
//         {!isMobile && (
//           <>
//             <Grid item xs={2} display='flex' justifyContent='center'>
//               <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//                 {stock.numberofshares}
//               </Typography>
//             </Grid>
//             <Grid item xs={2} display='flex' justifyContent='center'>
//               <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//                 ${stock.average_price}
//               </Typography>
//             </Grid>
//           </>
//         )}
//         <Grid item xs={isMobile ? 6 : 2} display='flex' justifyContent='center'>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             ${stock.current_price}
//           </Typography>
//         </Grid>
//         <Grid item xs={isMobile ? 6 : 3} display='flex' justifyContent='center' alignItems='center'>
//           <ProfitLossIcon sx={{ color: gainsColor }} />
//           <Typography variant='body1' sx={{ fontWeight: "bold", color: gainsColor, ml: 1 }}>
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
// ``;

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
//     <ListItem
//       divider
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//         "&:hover": {
//           backgroundColor: "action.hover", // Use theme's action.hover for a subtle hover effect
//           cursor: "pointer", // Change cursor to pointer to indicate item is interactive
//         },
//       }}
//     >
//       <Grid container justifyContent='space-between' spacing={2}>
//         <Grid item xs={3}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             {stock.stock_symbol} - {stock.company_name}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             {stock.numberofshares}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Typography variant='body1' sx={{ fontWeight: "bold" }}>
//             ${stock.average_price}
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
