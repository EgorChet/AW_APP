import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, TextField, Card, CardContent, Typography, Autocomplete, Grid } from "@mui/material";

const StockSearch = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [filteredStock, setFilteredStock] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllStocks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
        );
        setAllStocks(response.data);
      } catch (error) {
        console.error("Error fetching all stock symbols:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStocks();
  }, []);

  const handleSearch = (event, newValue) => {
    if (!newValue) {
      setFilteredStock(null);
      setNewsArticles([]);
      return;
    }
    setLoading(true);
    setSelectedStock(newValue);
    // Fetch stock details
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/${newValue.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
      )
      .then((response) => {
        setFilteredStock(response.data);
        // Fetch news for the selected stock
        fetchNews(newValue.name);
      })
      .catch((error) => {
        console.error("Error fetching stock details:", error);
        setFilteredStock(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchNews = (companyName) => {
    const encodedCompanyName = encodeURIComponent(companyName); // Encode the company name
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

  return (
    <div>
      <Autocomplete
        disablePortal
        id='stock-search'
        options={allStocks}
        getOptionLabel={(option) => option.name || ""}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label='Search for a stock by name' />}
        onChange={handleSearch}
        value={selectedStock}
        isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
        PaperComponent={({ children }) => (
          <Paper style={{ maxHeight: 150, overflow: "auto" }}>{children}</Paper> // Adjust maxHeight as needed
        )}
      />
      {loading && <Typography>Loading...</Typography>}
      {filteredStock && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant='outlined'>
              <Typography variant='h5'>
                {filteredStock.companyName} ({filteredStock.symbol})
              </Typography>
              <Typography>Latest Price: ${filteredStock.latestPrice}</Typography>
              <Typography>
                Change: {filteredStock.change > 0 ? "+" : ""}
                {filteredStock.change}
              </Typography>
              <Typography>
                Change Percent: {(filteredStock.changePercent * 100).toFixed(2)}%
              </Typography>
              <Typography>Change Percent: {filteredStock.avgTotalVolume}</Typography>
              <Typography>week52High: {filteredStock.week52High}</Typography>
              <Typography>week52Low: {filteredStock.week52Low}</Typography>
              <Typography>ytdChange: {filteredStock.ytdChange}</Typography>
            </Card>
          </Grid>
          {newsArticles.length > 0 && (
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mt: 2 }}>
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
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default StockSearch;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Paper, TextField, Card, CardContent, Typography, Autocomplete } from "@mui/material";

// const StockSearch = () => {
//   const [allStocks, setAllStocks] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [filteredStock, setFilteredStock] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllStocks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setAllStocks(response.data);
//       } catch (error) {
//         console.error("Error fetching all stock symbols:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllStocks();
//   }, []);

//   const handleSearch = (event, newValue) => {
//     if (!newValue) {
//       setFilteredStock(null);
//       return;
//     }
//     setLoading(true);
//     setSelectedStock(newValue);
//     // Use newValue.symbol since newValue is the selected stock object
//     axios
//       .get(
//         `https://cloud.iexapis.com/stable/stock/${newValue.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//       )
//       .then((response) => {
//         setFilteredStock(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock details:", error);
//         setFilteredStock(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div>
//   <Autocomplete
//     disablePortal
//     id='stock-search'
//     options={allStocks}
//     getOptionLabel={(option) => option.name || ""}
//     sx={{ width: 300 }}
//     renderInput={(params) => <TextField {...params} label='Search for a stock by name' />}
//     onChange={handleSearch}
//     value={selectedStock}
//     isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
//     PaperComponent={({ children }) => (
//       <Paper style={{ maxHeight: 150, overflow: "auto" }}>{children}</Paper> // Adjust maxHeight as needed
//     )}
//   />
//       {loading && <Typography>Loading...</Typography>}
//       {filteredStock && (
//         <Card variant='outlined' style={{ marginTop: "20px" }}>
//           <CardContent>
//             <Typography variant='h5'>
//               {filteredStock.companyName} ({filteredStock.symbol})
//             </Typography>
//             <Typography>Latest Price: ${filteredStock.latestPrice}</Typography>
//             <Typography>
//               Change: {filteredStock.change > 0 ? "+" : ""}
//               {filteredStock.change}
//             </Typography>
//             <Typography>
//               Change Percent: {(filteredStock.changePercent * 100).toFixed(2)}%
//             </Typography>
//             <Typography>Change Percent: {filteredStock.avgTotalVolume}</Typography>
//             <Typography>week52High: {filteredStock.week52High}</Typography>
//             <Typography>week52Low: {filteredStock.week52Low}</Typography>
//             <Typography>ytdChange: {filteredStock.ytdChange}</Typography>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default StockSearch;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Paper, TextField, Card, CardContent, Typography, Autocomplete } from "@mui/material";

// const StockSearch = () => {
//   const [allStocks, setAllStocks] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [filteredStock, setFilteredStock] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllStocks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//         );
//         setAllStocks(response.data);
//       } catch (error) {
//         console.error("Error fetching all stock symbols:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllStocks();
//   }, []);

//   const handleSearch = (event, newValue) => {
//     if (!newValue) {
//       setFilteredStock(null);
//       return;
//     }
//     setLoading(true);
//     setSelectedStock(newValue);
//     // Use newValue.symbol since newValue is the selected stock object
//     axios
//       .get(
//         `https://cloud.iexapis.com/stable/stock/${newValue.symbol}/quote?token=${process.env.REACT_APP_IEX_API_TOKEN}`
//       )
//       .then((response) => {
//         setFilteredStock(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock details:", error);
//         setFilteredStock(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div>
//       <Autocomplete
//         disablePortal
//         id='stock-search'
//         options={allStocks}
//         getOptionLabel={(option) => option.name || ""}
//         sx={{ width: 300 }}
//         renderInput={(params) => <TextField {...params} label='Search for a stock by name' />}
//         onChange={handleSearch}
//         value={selectedStock}
//         isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
//         PaperComponent={({ children }) => (
//           <Paper style={{ maxHeight: 150, overflow: "auto" }}>{children}</Paper> // Adjust maxHeight as needed
//         )}
//       />
//       {loading && <Typography>Loading...</Typography>}
//       {filteredStock && (
//         <Card variant='outlined' style={{ marginTop: "20px" }}>
//           <CardContent>
//             <Typography variant='h5'>
//               {filteredStock.companyName} ({filteredStock.symbol})
//             </Typography>
//             <Typography>Latest Price: ${filteredStock.latestPrice}</Typography>
//             <Typography>
//               Change: {filteredStock.change > 0 ? "+" : ""}
//               {filteredStock.change}
//             </Typography>
//             <Typography>
//               Change Percent: {(filteredStock.changePercent * 100).toFixed(2)}%
//             </Typography>
//             <Typography>Change Percent: {filteredStock.avgTotalVolume}</Typography>
//             <Typography>week52High: {filteredStock.week52High}</Typography>
//             <Typography>week52Low: {filteredStock.week52Low}</Typography>
//             <Typography>ytdChange: {filteredStock.ytdChange}</Typography>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default StockSearch;
