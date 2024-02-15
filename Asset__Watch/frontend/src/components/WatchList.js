import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import debounce from 'lodash/debounce';
import axiosInstance from '../config/axiosConfig';

const WatchList = () => {
  const [watchList, setWatchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalItems = watchList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPageData = watchList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItemExpansion = (symbol) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [symbol]: !prevState[symbol],
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginationDots = Array.from({ length: totalPages }, (_, index) => (
    <IconButton
      key={index}
      onClick={() => handlePageChange(null, index)}
      color={currentPage === index ? 'primary' : 'default'}
    >
      <FiberManualRecordIcon />
    </IconButton>
  ));

  // Integrated search logic from CompanySearch.js
  const searchCompanies = debounce(async (searchText) => {
    if (!searchText) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}&filter=symbol,name`);
      const filteredOptions = response.data.filter((option) => option.name.toLowerCase().includes(searchText.toLowerCase()));
      setAutocompleteOptions(filteredOptions);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchCompanies(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchWatchList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/watchlist/${userId}`);
        const watchListData = response.data;

        const watchListWithDetails = await Promise.all(
          watchListData.map(async (item) => {
            const url = `https://cloud.iexapis.com/stable/stock/${item.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`;
            try {
              const quoteResponse = await axios.get(url);
              const { companyName, latestPrice, changePercent } = quoteResponse.data;
              return {
                ...item,
                latestPrice,
                changePercent,
                companyName,
              };
            } catch (error) {
              console.error("Failed to fetch company data:", error);
              return item;
            }
          })
        );

        setWatchList(watchListWithDetails);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchList();
  }, [userId]);

  const handleAddToWatchList = (company) => {
    // Assuming an endpoint like this exists in your API or using the IEX API directly
    const url = `https://cloud.iexapis.com/stable/stock/${company.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`;

    axios
      .get(url)
      .then((quoteResponse) => {
        const { companyName, latestPrice, changePercent } = quoteResponse.data;
        const companyWithAdditionalData = {
          ...company,
          latestPrice,
          changePercent,
          companyName,
        };

        axiosInstance
          .post(`/watchlist/`, { userId: userId, symbol: company.symbol })
          .then(() => {
            setWatchList([...watchList, companyWithAdditionalData]);
          })
          .catch((error) => console.error("Failed to add to watchlist:", error));
      })
      .catch((error) => console.error("Failed to fetch company data:", error));
  };

  const handleRemoveFromWatchList = (symbol) => {
    axiosInstance
      .delete(`/watchlist/`, { data: { userId: userId, symbol } })
      .then(() => {
        setWatchList(watchList.filter((item) => item.symbol !== symbol));
      })
      .catch((error) => console.error("Failed to remove from watchlist:", error));
  };

  const handleNavigateToDetails = (symbol) => {
    navigate(`/details/${symbol}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Autocomplete
        sx={{ p: 1 }}
        freeSolo
        options={autocompleteOptions}
        getOptionLabel={(option) => `${option.name} (${option.symbol})`}
        onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a company"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={(event, newValue) => {
          if (!newValue) return;
          handleAddToWatchList(newValue);
        }}
      />
      {loading && <CircularProgress />}
      {!loading &&
        currentPageData.map((item, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              mt: 2,
              p: 1,
              mb: 1,
              backgroundColor: item.changePercent < 0 ? "#ffdddd" : "#ddffdd",
              cursor: "pointer",
            }}
            onClick={() => handleNavigateToDetails(item.symbol)}
          >
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs onClick={() => toggleItemExpansion(item.symbol)}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "inline",
                  }}
                >
                  {item.symbol}
                </Typography>
                {expandedItems[item.symbol] && (
                  <Typography sx={{ display: "inline", marginLeft: 1, fontSize: "0.8rem" }}>
                    - {item.companyName}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography sx={{ marginLeft: "2", marginRight: "2" }}>
                  ${item.latestPrice.toFixed(2)}
                </Typography>
                <Typography sx={{ color: item.changePercent < 0 ? "red" : "green" }}>
                  ({(item.changePercent * 100).toFixed(2)}%)
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when deleting
                    handleRemoveFromWatchList(item.symbol);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>{paginationDots}</Box>
    </Box>
  );
};

export default WatchList;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../config/axiosConfig";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/auth/authSlice";
// import {
//   Box,
//   TextField,
//   Autocomplete,
//   IconButton,
//   Paper,
//   Typography,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// const WatchList = () => {
//   const [watchList, setWatchList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [autocompleteOptions, setAutocompleteOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const currentUser = useSelector(selectCurrentUser);
//   const userId = currentUser?.id;
//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(0); // Current page index (0-based)
//   const itemsPerPage = 5; // Fixed number of items per page
//   const totalItems = watchList.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const currentPageData = watchList.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );
//   const [expandedItems, setExpandedItems] = useState({});

//   const toggleItemExpansion = (symbol) => {
//     setExpandedItems((prevState) => ({
//       ...prevState,
//       [symbol]: !prevState[symbol],
//     }));
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   // Generate dots for pagination
//   const paginationDots = Array.from({ length: totalPages }, (_, index) => (
//     <IconButton
//       key={index}
//       onClick={() => handlePageChange(null, index)}
//       color={currentPage === index ? "primary" : "default"}
//     >
//       <FiberManualRecordIcon /> {/* Material-UI icon for dots; ensure you've imported it */}
//     </IconButton>
//   ));

//   // Handle search
//   useEffect(() => {
//     let active = true;
//     if (searchQuery) {
//       setLoading(true);
//       axios
//         .get(
//           `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         )
//         .then((response) => {
//           if (active) {
//             const companies = response.data.filter((company) =>
//               company.name.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//             setAutocompleteOptions(companies);
//           }
//         })
//         .catch((error) => console.error("Failed to search companies:", error))
//         .finally(() => setLoading(false));
//     }
//     return () => {
//       active = false;
//     };
//   }, [searchQuery]);

//   useEffect(() => {
//     if (searchQuery.length > 2) {
//       // To avoid too broad searches
//       setLoading(true);
//       axiosInstance
//         .get(`/search/companies?query=${searchQuery}`)
//         .then((response) => {
//           setAutocompleteOptions(response.data);
//         })
//         .catch((error) => console.error("Failed to search companies:", error))
//         .finally(() => setLoading(false));
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     // Function to fetch watchlist from the backend
//     const fetchWatchList = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(`/watchlist/${userId}`);
//         const watchListData = response.data;

//         // Fetch additional data for each symbol in the watchlist
//         const watchListWithDetails = await Promise.all(
//           watchListData.map(async (item) => {
//             const url = `https://cloud.iexapis.com/stable/stock/${item.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`;
//             try {
//               const quoteResponse = await axios.get(url);
//               const { companyName, latestPrice, changePercent } = quoteResponse.data;
//               return {
//                 ...item,
//                 latestPrice,
//                 changePercent,
//                 companyName,
//               };
//             } catch (error) {
//               console.error("Failed to fetch company data:", error);
//               return item; // Return the item without additional data in case of an error
//             }
//           })
//         );

//         setWatchList(watchListWithDetails);
//       } catch (error) {
//         console.error("Failed to fetch watchlist:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWatchList();
//   }, [userId]); // Dependency array includes userId to refetch if userId changes

//   const handleAddToWatchList = (company) => {
//     // Assuming an endpoint like this exists in your API or using the IEX API directly
//     const url = `https://cloud.iexapis.com/stable/stock/${company.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`;

//     axios
//       .get(url)
//       .then((quoteResponse) => {
//         const { companyName, latestPrice, changePercent } = quoteResponse.data;
//         const companyWithAdditionalData = {
//           ...company,
//           latestPrice,
//           changePercent,
//           companyName,
//         };

//         axiosInstance
//           .post(`/watchlist/`, { userId: userId, symbol: company.symbol })
//           .then(() => {
//             setWatchList([...watchList, companyWithAdditionalData]);
//           })
//           .catch((error) => console.error("Failed to add to watchlist:", error));
//       })
//       .catch((error) => console.error("Failed to fetch company data:", error));
//   };

//   const handleRemoveFromWatchList = (symbol) => {
//     axiosInstance
//       .delete(`/watchlist/`, { data: { userId: userId, symbol } })
//       .then(() => {
//         setWatchList(watchList.filter((item) => item.symbol !== symbol));
//       })
//       .catch((error) => console.error("Failed to remove from watchlist:", error));
//   };

//   const handleNavigateToDetails = (symbol) => {
//     navigate(`/details/${symbol}`);
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Autocomplete
//         sx={{ p: 1 }}
//         freeSolo
//         options={autocompleteOptions}
//         getOptionLabel={(option) => `${option.name} (${option.symbol})`}
//         onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label='Search for a company'
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <React.Fragment>
//                   {loading ? <CircularProgress color='inherit' size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </React.Fragment>
//               ),
//             }}
//           />
//         )}
//         onChange={(event, newValue) => {
//           if (!newValue) return;
//           handleAddToWatchList(newValue);
//         }}
//       />
//       {loading && <CircularProgress />}
//       {!loading &&
//         currentPageData.map((item, index) => (
//           <Paper
//             key={index}
//             elevation={2}
//             sx={{
//               mt: 2,
//               p: 1,
//               mb: 1,
//               backgroundColor: item.changePercent < 0 ? "#ffdddd" : "#ddffdd", // Conditional coloring
//               cursor: "pointer", // Indicate the row is clickable
//             }}
//             onClick={() => handleNavigateToDetails(currentUser.symbol)} // Navigate when the row is clicked
//           >
//             <Grid container alignItems='center' justifyContent='space-between' spacing={2}>
//               <Grid item xs onClick={() => toggleItemExpansion(item.symbol)}>
//                 <Typography
//                   sx={{
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                     display: "inline",
//                   }}
//                 >
//                   {item.symbol}
//                 </Typography>
//                 {expandedItems[item.symbol] && (
//                   <Typography sx={{ display: "inline", marginLeft: 1, fontSize: "0.8rem" }}>
//                     - {item.companyName}
//                   </Typography>
//                 )}
//               </Grid>
//               <Grid item>
//                 <Typography sx={{ marginLeft: "2", marginRight: "2" }}>
//                   ${item.latestPrice.toFixed(2)}
//                 </Typography>
//                 <Typography sx={{ color: item.changePercent < 0 ? "red" : "green" }}>
//                   ({(item.changePercent * 100).toFixed(2)}%)
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent navigation when deleting
//                     handleRemoveFromWatchList(item.symbol);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </Paper>
//         ))}
//       <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>{paginationDots}</Box>
//     </Box>
//   );
// };

// export default WatchList;
