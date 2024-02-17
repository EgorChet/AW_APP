import React from "react";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";

const PortfolioHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        {["Company", "Shares", "Avg Price", "Current Price", "Profit/Loss"].map((header, index) => (
          <Grid item xs={2} key={index} sx={{ textAlign: "center", transform: isMobile ? 'rotate(-90deg)' : 'none', mb: isMobile ? 2 : 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{header}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PortfolioHeader;