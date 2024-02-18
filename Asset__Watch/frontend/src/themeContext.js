// themeContext.js

import React, { createContext, useContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "dark"
      ? {
          // Dark mode palette adjustments
          background: {
            default: "#2E2E2E", // "black.pepper"
            paper: "#424242",
          },
          text: {
            primary: "#E0E0E0", // Off-white for better readability in dark mode
            secondary: "#B3B3B3", // Slightly dimmer than primary for less emphasis
          },
        }
      : {
          // Light mode palette adjustments
          background: {
            default: "#f7f7f7",
            paper: "#ffffff",
          },
          text: {
            primary: "#1A1A1A", // Off-black for better readability in light mode
            secondary: "F4F#4F4", // Slightly lighter for less emphasis
          },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === "dark" ? "#2E2E2E" : "#f7f7f7",
          color: mode === "dark" ? "#E0E0E0" : "#1A1A1A",
        },
      },
    },
    // Adjust TextField styles for better visibility
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: mode === "dark" ? "#90caf9" : "#1976d2",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: mode === "dark" ? "#90caf9" : "#1976d2",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: mode === "dark" ? "#b3b3b3" : "#4f4f4f",
            },
            "&:hover fieldset": {
              borderColor: mode === "dark" ? "#ffffff" : "#000000",
            },
            "&.Mui-focused fieldset": {
              borderColor: mode === "dark" ? "#90caf9" : "#1976d2",
            },
          },
        },
      },
    },
    // Adjust Alert styles if needed
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#333333" : "#e0e0e0",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    // Add other component customizations as needed
  },
});
export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const theme = createTheme(getDesignTokens(mode));

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

CustomThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
