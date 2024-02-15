import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; //, useNavigate
import axios from "axios";
import { Box, Typography, CircularProgress, Card, CardContent, IconButton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import axiosInstance from "../config/axiosConfig";
import { Autocomplete, TextField } from "@mui/material";

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id; // Assuming you have user ID in your auth slice

  const [stockDetails, setStockDetails] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allStocks, setAllStocks] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch all stocks for the search autocomplete
    const fetchAllStocks = async () => {
      try {
        const response = await axios.get(
          `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setAllStocks(response.data);
      } catch (error) {
        console.error("Error fetching all stock symbols:", error);
      }
    };

    fetchAllStocks();
  }, []);

  const handleStockSelection = (event, newValue) => {
    if (newValue) {
      // Use the symbol from the selected stock to fetch new details
      const newSymbol = newValue.symbol;
      navigate(`/details/${newSymbol}`); // This will trigger the useEffect to refetch data
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const stockResponse = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setStockDetails(stockResponse.data);

        // Fetch news articles based on the company name
        fetchNews(stockResponse.data.companyName);

        // Check if the stock is in the user's watchlist
        const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
        const watchListData = watchListResponse.data;
        setIsInWatchlist(watchListData.some((item) => item.symbol === symbol));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol, userId]);

  const fetchNews = (companyName) => {
    const encodedCompanyName = encodeURIComponent(companyName);
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodedCompanyName}&from=2024-01-14&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_TOKEN}`;

    axios
      .get(newsApiUrl)
      .then((response) => {
        setNewsArticles(response.data.articles);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  };

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await axiosInstance.delete(`/watchlist/`, { data: { userId, symbol } });
      } else {
        // Add to watchlist
        await axiosInstance.post(`/watchlist/`, { userId, symbol });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Autocomplete
        disablePortal
        options={allStocks}
        getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
        sx={{ width: 300, mb: 2 }}
        onChange={handleStockSelection}
        renderInput={(params) => (
          <TextField {...params} label='Search for a stock' variant='outlined' />
        )}
      />
      {stockDetails && (
        <Box>
          <Typography variant='h4'>
            {stockDetails.companyName} ({symbol})
            <IconButton onClick={toggleWatchlist} color='primary'>
              {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Typography>
          <Typography>Latest Price: ${stockDetails.latestPrice.toFixed(2)}</Typography>
          <Typography>
            Change: {stockDetails.change > 0 ? "+" : ""}
            {stockDetails.change.toFixed(2)}
          </Typography>
          <Typography>Change Percent: {(stockDetails.changePercent * 100).toFixed(2)}%</Typography>
          <Typography>Week 52 High: ${stockDetails.week52High.toFixed(2)}</Typography>
          <Typography>Week 52 Low: ${stockDetails.week52Low.toFixed(2)}</Typography>
          <Typography>YTD Change: {(stockDetails.ytdChange * 100).toFixed(2)}%</Typography>
        </Box>
      )}
      <Typography variant='h5' sx={{ mt: 4 }}>
        News
      </Typography>
      {newsArticles.map((article, index) => (
        <Card key={index} variant='outlined' sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant='h6'>{article.title}</Typography>
            <Typography variant='body2'>{article.description}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {article.publishedAt}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StockDetails;
