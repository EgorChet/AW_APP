import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Paper, useTheme } from "@mui/material";

const indicesSymbols = ["SPY", "DIA", "USD", "AAPL", "INTC"];

const WorldIndices = () => {
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme(); // Using theme for consistent styling

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const requests = indicesSymbols.map((symbol) =>
          axios.get(
            `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
          )
        );

        const responses = await Promise.all(requests);
        const data = responses.map((response) => response.data);
        setIndicesData(data);
      } catch (error) {
        console.error("Error fetching data from IEX Cloud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mx: 2 }}>
      {indicesData.length > 0 ? (
        indicesData.map((index, idx) => (
          <Paper
            elevation={3}
            key={idx}
            sx={{ p: 2, mb: 2, backgroundColor: index.change >= 0 ? "#e8f5e9" : "#ffebee" }}
          >
            <Typography variant='h6' component='div' sx={{color: "#757575"}}>
              {index.symbol}: {index.latestPrice}
            </Typography>
            <Typography
              component='div'
              sx={{
                color: index.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: "medium",
              }}
            >
              Change: {index.change} ({(index.changePercent * 100).toFixed(2)}%)
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  );
};

export default WorldIndices;
