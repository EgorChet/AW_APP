// CompanySearch.js
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const CompanySearch = ({ onCompanySelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Debounced search function
  const searchCompanies = debounce(async (searchText) => {
    if (!searchText) return;
    try {
      const response = await axios.get(`https://cloud.iexapis.com/stable/ref-data/symbols?token=${process.env.REACT_APP_IEX_API_TOKEN}&filter=symbol,name`);
      const filteredOptions = response.data.filter((option) => option.name.toLowerCase().includes(searchText.toLowerCase()));
      setOptions(filteredOptions);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, 500);

  useEffect(() => {
    searchCompanies(inputValue);
  }, [inputValue]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, newValue) => onCompanySelect(newValue)}
      renderInput={(params) => <TextField {...params} label="Search for a company" variant="outlined" />}
    />
  );
};

CompanySearch.propTypes = {
  onCompanySelect: PropTypes.func.isRequired,
};

export default CompanySearch;
