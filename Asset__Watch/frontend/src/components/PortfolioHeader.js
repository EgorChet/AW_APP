import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const PortfolioHeader = () => {
  const iconStyle = { fontSize: "2rem" }; // Adjust the icon size as needed

  return (
    <Box sx={{ mt: 10, mb: 5 }}>
      {" "}
      {/* Add vertical margin to the Box wrapping the Grid */}
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item xs={3} sx={{ textAlign: "center" }}>
          <BusinessCenterIcon style={iconStyle} />
          <Typography variant='subtitle1' sx={{ fontWeight: "bold", mt: 1 }}>
            Company
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <ShareIcon style={iconStyle} />
          <Typography variant='subtitle1' sx={{ fontWeight: "bold", mt: 1 }}>
            Shares
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <AttachMoneyIcon style={iconStyle} />
          <Typography variant='subtitle1' sx={{ fontWeight: "bold", mt: 1 }}>
            Avg Price
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <PriceCheckIcon style={iconStyle} />
          <Typography variant='subtitle1' sx={{ fontWeight: "bold", mt: 1 }}>
            Current Price
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ textAlign: "center" }}>
          <ShowChartIcon style={iconStyle} />
          <Typography variant='subtitle1' sx={{ fontWeight: "bold", mt: 1 }}>
            Profit/Loss
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioHeader;
