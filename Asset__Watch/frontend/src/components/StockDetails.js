import axiosInstance from "../config/axiosConfig";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import StockDetailsSection from "./StockDetailsSection";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;

  const [stockDetails, setStockDetails] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allStocks, setAllStocks] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState("");

  useEffect(() => {
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

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const stockResponse = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setStockDetails(stockResponse.data);

        const newsResponse = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            stockResponse.data.companyName
          )}&from=2024-01-14&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_TOKEN}`
        );
        setNewsArticles(newsResponse.data.articles.slice(0, 5));

        const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
        setIsInWatchlist(watchListResponse.data.some((item) => item.symbol === symbol));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol, userId]);

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axiosInstance.delete(`/watchlist/`, { data: { userId, symbol } });
      } else {
        await axiosInstance.post(`/watchlist/`, { userId, symbol });
      }
      setIsInWatchlist(!isInWatchlist);
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
      allStocks={allStocks}
      handleStockSelectionChange={handleStockSelectionChange}
      handleSearch={handleSearch}
      setSearchSymbol={setSearchSymbol}
      newsArticles={newsArticles}
      expandedIds={expandedIds}
      toggleExpanded={toggleExpanded}
    />
  );
};

export default StockDetails;