import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Alert,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Autocomplete,
  TextField,
  Grid,
  CardActionArea,
  CardMedia,
  Container,
  Collapse,
  CardHeader,
  Avatar,
  useTheme,
} from "@mui/material";
import CustomButton from "./CustomButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";

// Define StockDetailsSection outside of StockDetails component
const StockDetailsSection = ({
  stockDetails,
  loading,
  symbol,
  isInWatchlist,
  toggleWatchlist,
  allStocks,
  handleStockSelectionChange,
  handleSearch,
  newsArticles,
  expandedIds,
  toggleExpanded,
}) => {
  const theme = useTheme();

  const getPriceChangeIcon = (change) => {
    return change > 0 ? (
      <ArrowUpwardIcon style={{ color: theme.palette.success.main }} />
    ) : (
      <ArrowDownwardIcon style={{ color: theme.palette.error.main }} />
    );
  };

  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (loading) {
    return (
      <Container
        sx={{
          mt: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 10, display: "flex", justifyContent: "center" }}>
        <Autocomplete
          disablePortal
          options={allStocks}
          getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
          style={{ width: "50%" }}
          onChange={handleStockSelectionChange}
          renderInput={(params) => (
            <TextField {...params} label='Search for a stock' variant='outlined' />
          )}
        />
        <CustomButton onClick={handleSearch} startIcon={<SearchIcon />} sx={{ ml: 1 }}>
          Search
        </CustomButton>
      </Box>
      {stockDetails && (
        <Box textAlign='center' my={4}>
          <Typography variant='h4' gutterBottom>
            {stockDetails.companyName} ({symbol})
            <IconButton onClick={toggleWatchlist} color='primary'>
              {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Typography>
          <Card sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    bgcolor:
                      stockDetails.change >= 0
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                  }}
                >
                  {getPriceChangeIcon(stockDetails.change)}
                </Avatar>
              }
              title={`${stockDetails.companyName} (${stockDetails.symbol})`}
              titleTypographyProps={{ align: "center", variant: "h6" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Latest Price: ${stockDetails.latestPrice.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Change: {stockDetails.change > 0 ? "+" : ""}
                    {stockDetails.change.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Change Percent:{" "}
                    {stockDetails.changePercent
                      ? `${(stockDetails.changePercent * 100).toFixed(2)}%`
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Week 52 High: ${stockDetails.week52High.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Week 52 Low: ${stockDetails.week52Low.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    YTD Change:{" "}
                    {stockDetails.ytdChange
                      ? `${(stockDetails.ytdChange * 100).toFixed(2)}%`
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
      <Typography variant='h5' gutterBottom sx={{ textAlign: "center" }}>
        Latest News
      </Typography>
      {!isLocalhost && (
        <Alert severity='info' sx={{ my: 2 }}>
          News feature is available only in the local development environment due to API
          restrictions.
        </Alert>
      )}
      {newsArticles.map((article, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardActionArea component='a' href={article.url} target='_blank'>
            {article.urlToImage && (
              <CardMedia
                component='img'
                height='140'
                image={article.urlToImage}
                alt={article.title}
              />
            )}
          </CardActionArea>
          <CardContent>
            <Typography gutterBottom variant='h6' component='div'>
              {article.title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {article.description}
            </Typography>
            <Collapse in={expandedIds[index] || false} timeout='auto' unmountOnExit>
              <Typography variant='body2' color='text.secondary'>
                {article.content}
              </Typography>
            </Collapse>
            <CustomButton size='small' onClick={() => toggleExpanded(index)}>
              {expandedIds[index] ? "Less" : "More"}
            </CustomButton>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

StockDetailsSection.propTypes = {
  stockDetails: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  symbol: PropTypes.string.isRequired,
  isInWatchlist: PropTypes.bool.isRequired,
  toggleWatchlist: PropTypes.func.isRequired,
  allStocks: PropTypes.array.isRequired,
  handleStockSelectionChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  setSearchSymbol: PropTypes.func.isRequired,
  newsArticles: PropTypes.array.isRequired,
  expandedIds: PropTypes.object.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};

export default StockDetailsSection;
