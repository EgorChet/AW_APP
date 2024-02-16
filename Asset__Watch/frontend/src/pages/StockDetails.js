import axiosInstance from "../config/axiosConfig";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import StockDetailsSection from "../components/StockDetailsSection";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const [allStocks, setAllStocks] = useState([]);

  const [stockDetails, setStockDetails] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchSymbol, setSearchSymbol] = useState("");

  useEffect(() => {
    const fetchAllStocks = async () => {
      try {
        const response = await axios.get(
          `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setAllStocks(response.data); // Ensure response.data is an array
      } catch (error) {
        console.error("Error fetching all stock symbols:", error);
        setAllStocks([]); // Ensure to set to an empty array on error
      }
    };
    fetchAllStocks();
  }, []);

  useEffect(() => {
    const fetchDetailsAndWatchlistStatus = async () => {
      setLoading(true);
  
      // Fetch Stock Details
      try {
        const stockResponse = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setStockDetails(stockResponse.data);
      } catch (error) {
        console.error("Failed to fetch stock details:", error);
      }
  
      // Fetch News Articles
      try {
        const newsResponse = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            symbol // Using symbol might be more reliable in case companyName is not found
          )}&from=2024-02-14&sortBy=popularity&apiKey=905c377bbff744e4afaf62e8134a1311`
        );
        setNewsArticles(newsResponse.data.articles.slice(0, 5));
      } catch (error) {
        console.warn("Failed to fetch news data or News API is not available in production:", error);
        setNewsArticles([]); // Consider setting to a default state or value
      }
  
      // Fetch Watchlist Status
      try {
        const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
        setIsInWatchlist(watchListResponse.data.some((item) => item.symbol === symbol));
      } catch (error) {
        console.error("Failed to fetch watchlist status:", error);
      }
  
      setLoading(false);
    };
  
    fetchDetailsAndWatchlistStatus();
  }, [symbol, userId]);

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axiosInstance.delete(`/watchlist/`, { data: { userId, symbol } });
      } else {
        await axiosInstance.post(`/watchlist/`, { userId, symbol });
      }
      // Re-fetch watchlist status to ensure UI consistency
      const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
      setIsInWatchlist(watchListResponse.data.some((item) => item.symbol === symbol));
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  const handleStockSelectionChange = (event, newValue) => {
    setSearchSymbol(newValue);
  };

  const handleSearch = () => {
    if (searchSymbol) {
      navigate(`/details/${searchSymbol.symbol}`);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <StockDetailsSection
      stockDetails={stockDetails}
      loading={loading}
      symbol={symbol}
      isInWatchlist={isInWatchlist}
      toggleWatchlist={toggleWatchlist}
      handleStockSelectionChange={handleStockSelectionChange}
      handleSearch={handleSearch}
      setSearchSymbol={setSearchSymbol}
      allStocks={allStocks}
      newsArticles={newsArticles}
      expandedIds={expandedIds}
      toggleExpanded={toggleExpanded}
    />
  );
};

export default StockDetails;
