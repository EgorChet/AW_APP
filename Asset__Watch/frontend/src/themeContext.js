// themeContext.js
import React, { createContext, useContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "dark" && {
        background: {
          default: "#121212",
          paper: "#424242",
        },
        text: {
          primary: "#gggggg",
          secondary: "#aaaaaa",
        },
      }),
    },
    components: {
      // Override styles for all instances of this component
      MuiInput: {
        styleOverrides: {
          input: {
            color: mode === "dark" ? "#gggggg" : "#000000", // Adjust text color based on theme
          },
          underline: {
            "&:before": {
              borderBottom: `1px solid ${mode === "dark" ? "#ffffff" : "#000000"}`,
            },
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: `2px solid ${mode === "dark" ? "#ffffff" : "#000000"}`, // Ensure the underline is visible
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#gggggg" : "#000000", // Adjust border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#bbbbbb" : "#444444", // Hover state
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#ffffff" : "#000000", // Focus state
            },
          },
          input: {
            color: mode === "dark" ? "#ffffff" : "#000000", // Text color
          },
        },
      },
      // Add more component overrides as needed
    },
  });

  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
  };

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Add PropTypes validation for children
CustomThemeProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validates that children is a React node
};
