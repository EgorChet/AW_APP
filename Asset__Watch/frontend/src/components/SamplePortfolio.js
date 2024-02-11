import React from "react";
import { Card, CardContent, Typography, Box, List, Grid, ListItem } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PortfolioStats from "./PortfolioStats"; // Make sure this path is correct

// Sample data for the portfolio, assuming currentPrice is dynamically fetched or calculated
const sampleStocks = [
  { symbol: "AAPL", shares: 50, avgPrice: 120, currentPrice: 130 },
  { symbol: "MSFT", shares: 30, avgPrice: 200, currentPrice: 210 },
  { symbol: "AMZN", shares: 10, avgPrice: 3100, currentPrice: 3200 },
  { symbol: "TSLA", shares: 5, avgPrice: 600, currentPrice: 650 },
  { symbol: "SPY", shares: 5, avgPrice: 600, currentPrice: 650 },
];

// Convert sampleStocks to match the expected structure for PortfolioStats
const stocksForStats = sampleStocks.map((stock) => ({
  numberofshares: stock.shares,
  average_price: stock.avgPrice,
  current_price: stock.currentPrice,
}));

const SamplePortfolio = () => {
  return (
    <Box>
      <PortfolioStats stocks={stocksForStats} />
      <Card raised sx={{ maxWidth: 700, mx: "auto", my: 1 }}>
        <CardContent>
          <List>
            {sampleStocks.map((stock, index) => {
              const gain = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
              const isGain = gain >= 0;
              const gainsColor = isGain ? "green" : "red";
              const ProfitLossIcon = isGain ? ShowChartIcon : TrendingDownIcon;

              return (
                <ListItem key={index} divider={index !== sampleStocks.length - 1} sx={{ py: 2 }}>
                  <Grid container alignItems='center' justifyContent='space-between'>
                    <Grid item xs={4}>
                      <Typography variant='body1' sx={{ fontWeight: "bold" }}>
                        {stock.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign='center'>
                      <Typography variant='body1'>Shares: {stock.shares}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      textAlign='right'
                      sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <ProfitLossIcon sx={{ color: gainsColor }} />
                      <Typography variant='body1' sx={{ color: gainsColor, ml: 1 }}>
                        {`${isGain ? "+" : ""}${gain.toFixed(2)}%`}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant='body2'>
              *This is a sample portfolio for demonstration purposes only.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SamplePortfolio;

// import React from "react";
// import { Card, CardContent, Typography, Box, Divider, List, Grid, ListItem } from "@mui/material";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// // Sample data for the portfolio
// const sampleStocks = [
//   { symbol: "AAPL", shares: 50, avgPrice: 120, currentPrice: 130 }, // Added currentPrice for demonstration
//   { symbol: "MSFT", shares: 30, avgPrice: 200, currentPrice: 210 },
//   { symbol: "AMZN", shares: 10, avgPrice: 3100, currentPrice: 3200 },
//   { symbol: "TSLA", shares: 5, avgPrice: 600, currentPrice: 650 },
// ];

// const SamplePortfolio = () => {
//   return (
//     <Card raised sx={{ maxWidth: 700, mx: "auto", my: 1 }}>
//       <CardContent>
//         <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
//           Sample Portfolio
//         </Typography>
//         <Divider sx={{ my: 2 }} />
//         <List>
//           {sampleStocks.map((stock, index) => {
//             const gain = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
//             const isGain = gain >= 0;
//             const gainsColor = isGain ? "green" : "red";
//             const ProfitLossIcon = isGain ? ShowChartIcon : TrendingDownIcon;

//             return (
//               <ListItem key={index} divider={index !== sampleStocks.length - 1} sx={{ py: 2 }}>
//                 <Grid container alignItems="center" justifyContent="space-between">
//                   <Grid item xs={4}>
//                     <Typography variant="body1" sx={{ fontWeight: "bold" }}>
//                       {stock.symbol}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={4} textAlign="center">
//                     <Typography variant="body1">
//                       Shares: {stock.shares}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={4} textAlign="right" sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
//                     <ProfitLossIcon sx={{ color: gainsColor }} />
//                     <Typography variant="body1" sx={{ color: gainsColor, ml: 1 }}>
//                       {`${isGain ? "+" : ""}${gain.toFixed(2)}%`}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </ListItem>
//             );
//           })}
//         </List>
//         <Box sx={{ textAlign: "center", mt: 2 }}>
//           <Typography variant='body2'>
//             *This is a sample portfolio for demonstration purposes only.
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default SamplePortfolio;

// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";

// // Sample data for the portfolio
// const sampleStocks = [
//   { symbol: "AAPL", shares: 50, avgPrice: 120 },
//   { symbol: "MSFT", shares: 30, avgPrice: 200 },
//   { symbol: "AMZN", shares: 10, avgPrice: 3100 },
//   { symbol: "TSLA", shares: 5, avgPrice: 600 },
//   { symbol: "AMZN", shares: 10, avgPrice: 3100 },
//   { symbol: "AMZN", shares: 10, avgPrice: 3100 },
// ];

// const SamplePortfolio = () => {
//   return (
//     <Card raised sx={{ maxWidth: 700, mx: "auto", my: 1 }}>
//       <CardContent>
//         <Divider sx={{ my: 2 }} />
//         <List>
//           {sampleStocks.map((stock, index) => (
//             <ListItem key={index} divider={index !== sampleStocks.length - 1}>
//               <ListItemText
//                 primary={stock.symbol}
//                 secondary={`Shares: ${stock.shares}, Avg. Price: $${stock.avgPrice}`}
//               />
//             </ListItem>
//           ))}
//         </List>
//         <Box sx={{ textAlign: "center" }}>
//           <Typography variant='body2'>
//             *This is a sample portfolio for demonstration purposes only.
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default SamplePortfolio;
