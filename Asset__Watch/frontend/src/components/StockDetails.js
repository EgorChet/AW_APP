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

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   IconButton,
//   Autocomplete,
//   TextField,
//   Button,
//   Grid,
//   CardActionArea,
//   CardMedia,
// } from "@mui/material";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import StarIcon from "@mui/icons-material/Star";
// import SearchIcon from "@mui/icons-material/Search";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/auth/authSlice";
// import axiosInstance from "../config/axiosConfig";

// const StockDetails = () => {
//   const { symbol } = useParams();
//   const navigate = useNavigate();
//   const currentUser = useSelector(selectCurrentUser);
//   const userId = currentUser?.id;

//   const [stockDetails, setStockDetails] = useState(null);
//   const [newsArticles, setNewsArticles] = useState([]);
//   const [isInWatchlist, setIsInWatchlist] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [allStocks, setAllStocks] = useState([]);
//   const [searchSymbol, setSearchSymbol] = useState("");

//   useEffect(() => {
//     const fetchAllStocks = async () => {
//       try {
//         const response = await axios.get(
//           `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setAllStocks(response.data);
//       } catch (error) {
//         console.error("Error fetching all stock symbols:", error);
//       }
//     };
//     fetchAllStocks();
//   }, []);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       setLoading(true);
//       try {
//         const stockResponse = await axios.get(
//           `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setStockDetails(stockResponse.data);

//         const newsResponse = await axios.get(
//           `https://newsapi.org/v2/everything?q=${encodeURIComponent(
//             stockResponse.data.companyName
//           )}&from=2024-01-14&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_TOKEN}`
//         );
//         setNewsArticles(newsResponse.data.articles.slice(0, 5));

//         const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
//         setIsInWatchlist(watchListResponse.data.some((item) => item.symbol === symbol));
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [symbol, userId]);

//   const toggleWatchlist = async () => {
//     try {
//       if (isInWatchlist) {
//         await axiosInstance.delete(`/watchlist/`, { data: { userId, symbol } });
//       } else {
//         await axiosInstance.post(`/watchlist/`, { userId, symbol });
//       }
//       setIsInWatchlist(!isInWatchlist);
//     } catch (error) {
//       console.error("Failed to update watchlist:", error);
//     }
//   };

//   const handleStockSelectionChange = (event, newValue) => {
//     setSearchSymbol(newValue);
//   };

//   const handleSearch = () => {
//     if (searchSymbol) {
//       navigate(`/details/${searchSymbol.symbol}`);
//     }
//   };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Grid container justifyContent='center' spacing={2}>
//         <Grid item xs={12} md={8}>
//           <Box display='flex' justifyContent='center'>
//             <Autocomplete
//               disablePortal
//               id='stock-search'
//               options={allStocks}
//               getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
//               sx={{ width: 300 }}
//               onChange={handleStockSelectionChange}
//               renderInput={(params) => <TextField {...params} label='Search for a stock' />}
//             />
//             <Button
//               variant='contained'
//               color='primary'
//               onClick={handleSearch}
//               startIcon={<SearchIcon />}
//               sx={{ ml: 2 }}
//             >
//               Search
//             </Button>
//           </Box>
//         </Grid>
//         {stockDetails && (
//           <Grid item xs={12} md={8}>
//             <Box textAlign='center' my={4}>
//               <Typography variant='h4' gutterBottom>
//                 {stockDetails.companyName} ({symbol})
//                 <IconButton onClick={toggleWatchlist} color='primary'>
//                   {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
//                 </IconButton>
//               </Typography>
//               <Typography variant='subtitle1'>
//                 Latest Price: ${stockDetails.latestPrice.toFixed(2)}
//               </Typography>
//               <Typography variant='subtitle1'>
//                 Change: {stockDetails.change > 0 ? "+" : ""}
//                 {stockDetails.change.toFixed(2)}
//               </Typography>
//               <Typography variant='subtitle1'>
//                 Change Percent:{" "}
//                 {stockDetails.changePercent
//                   ? `${(stockDetails.changePercent * 100).toFixed(2)}%`
//                   : "N/A"}
//               </Typography>
//               <Typography variant='subtitle1'>
//                 Week 52 High: ${stockDetails.week52High.toFixed(2)}
//               </Typography>
//               <Typography variant='subtitle1'>
//                 Week 52 Low: ${stockDetails.week52Low.toFixed(2)}
//               </Typography>
//               <Typography variant='subtitle1'>
//                 YTD Change:{" "}
//                 {stockDetails.ytdChange ? `${(stockDetails.ytdChange * 100).toFixed(2)}%` : "N/A"}
//               </Typography>
//             </Box>
//           </Grid>
//         )}
//         <Grid item xs={12} md={8}>
//           <Typography variant='h5' gutterBottom sx={{ textAlign: "center" }}>
//             Latest News
//           </Typography>
//           {newsArticles.map((article, index) => (
//             <Card key={index} variant='outlined' sx={{ mb: 2 }}>
//               <CardActionArea href={article.url} target='_blank'>
//                 {article.urlToImage && (
//                   <CardMedia
//                     component='img'
//                     height='480'
//                     image={article.urlToImage}
//                     alt={article.title}
//                   />
//                 )}
//                 <CardContent>
//                   <Typography gutterBottom variant='h6' component='div'>
//                     {article.title}
//                   </Typography>
//                   <Typography variant='body2' color='text.secondary'>
//                     {article.description}
//                   </Typography>
//                   <Typography variant='body2' color='text.secondary'>
//                     {article.content}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           ))}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default StockDetails;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   IconButton,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import StarIcon from "@mui/icons-material/Star";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/auth/authSlice";
// import axiosInstance from "../config/axiosConfig";

// const StockDetails = () => {
//   const { symbol } = useParams();
//   const navigate = useNavigate();
//   const currentUser = useSelector(selectCurrentUser);
//   const userId = currentUser?.id;

//   const [stockDetails, setStockDetails] = useState(null);
//   const [newsArticles, setNewsArticles] = useState([]);
//   const [isInWatchlist, setIsInWatchlist] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [allStocks, setAllStocks] = useState([]);

//   useEffect(() => {
//     const fetchAllStocks = async () => {
//       try {
//         const response = await axios.get(
//           `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setAllStocks(response.data);
//       } catch (error) {
//         console.error("Error fetching all stock symbols:", error);
//       }
//     };
//     fetchAllStocks();
//   }, []);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       setLoading(true);
//       try {
//         const stockResponse = await axios.get(
//           `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setStockDetails(stockResponse.data);

//         const newsResponse = await axios.get(
//           `https://newsapi.org/v2/everything?q=${encodeURIComponent(
//             stockResponse.data.companyName
//           )}&from=2024-01-14&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_TOKEN}`
//         );
//         setNewsArticles(newsResponse.data.articles);

//         const watchListResponse = await axiosInstance.get(`/watchlist/${userId}`);
//         setIsInWatchlist(watchListResponse.data.some((item) => item.symbol === symbol));
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [symbol, userId]);

//   const handleStockSelection = (event, newValue) => {
//     if (newValue) {
//       navigate(`/details/${newValue.symbol}`);
//     }
//   };

// const toggleWatchlist = async () => {
//   try {
//     if (isInWatchlist) {
//       await axiosInstance.delete(`/watchlist/`, { data: { userId, symbol } });
//     } else {
//       await axiosInstance.post(`/watchlist/`, { userId, symbol });
//     }
//     setIsInWatchlist(!isInWatchlist);
//   } catch (error) {
//     console.error("Failed to update watchlist:", error);
//   }
// };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Autocomplete
//         disablePortal
//         id='stock-search'
//         options={allStocks}
//         getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
//         sx={{ width: 300, mb: 2 }}
//         onChange={handleStockSelection}
//         renderInput={(params) => (
//           <TextField {...params} label='Search for a stock' variant='outlined' />
//         )}
//       />
//       {stockDetails && (
//         <Box>
//           <Typography variant='h4'>
//             {stockDetails.companyName} ({symbol})
//             <IconButton onClick={toggleWatchlist} color='primary'>
//               {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
//             </IconButton>
//           </Typography>
//           <Typography>
//             Latest Price: ${stockDetails.latestPrice ? stockDetails.latestPrice.toFixed(2) : "N/A"}
//           </Typography>
//           <Typography>
//             Change: ${stockDetails.change ? stockDetails.change.toFixed(2) : "N/A"}
//           </Typography>
//           <Typography>
//             Change Percent:{" "}
//             {stockDetails.changePercent
//               ? `${(stockDetails.changePercent * 100).toFixed(2)}%`
//               : "N/A"}
//           </Typography>
//           <Typography>
//             Week 52 High: ${stockDetails.week52High ? stockDetails.week52High.toFixed(2) : "N/A"}
//           </Typography>
//           <Typography>
//             Week 52 Low: ${stockDetails.week52Low ? stockDetails.week52Low.toFixed(2) : "N/A"}
//           </Typography>
//           <Typography>
//             YTD Change:{" "}
//             {stockDetails.ytdChange ? `${(stockDetails.ytdChange * 100).toFixed(2)}%` : "N/A"}
//           </Typography>
//         </Box>
//       )}
//       <Typography variant='h5' sx={{ mt: 4 }}>
//         News
//       </Typography>
//       {newsArticles.map((article, index) => (
//         <Card key={index} variant='outlined' sx={{ mb: 2 }}>
//           <CardContent>
//             <Typography variant='h6'>{article.title}</Typography>
//             <Typography variant='body2'>{article.description}</Typography>
//             <Typography variant='body2' color='text.secondary'>
//               {article.publishedAt}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default StockDetails;
