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


// import React, { createContext, useContext, useState, useEffect } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import PropTypes from "prop-types";

// const ThemeContext = createContext();

// export const useThemeContext = () => useContext(ThemeContext);

// export const CustomThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState("light");
//   const [theme, setTheme] = useState(null);

//   // Define the color palette for light and dark mode
//   const lightPalette = {
//     primary: { main: "#2f4d65" }, // A dark blue shade
//     secondary: { main: "#796f6d" }, // A warm gray shade
//     background: {
//       default: "#bab5bb", // A light gray shade
//       paper: "#ffffff",
//     },
//     text: {
//       primary: "#3e4e5d", // A dark gray shade
//       secondary: "#869099", // A muted blue-gray shade
//     },
//   };

//   const darkPalette = {
//     primary: { main: "#869099" }, // Muted blue-gray as primary color
//     secondary: { main: "#3e4e5d" }, // Dark gray-blue as secondary color
//     background: {
//       default: "#121212", // Very dark shade for background
//       paper: "#424242",
//     },
//     text: {
//       primary: "#ffffff", // White text for readability
//       secondary: "#bab5bb", // Light gray for secondary text
//     },
//   };

//   useEffect(() => {
//     const currentTheme = createTheme({
//       palette: {
//         mode,
//         ...(mode === "dark" ? darkPalette : lightPalette),
//       },
//       components: {
//         MuiContainer: {
//           styleOverrides: {
//             root: {
//               padding: "20px",
//             },
//           },
//         },
//         MuiTypography: {
//           styleOverrides: {
//             root: {
//               color: mode === "dark" ? "#ffffff" : "#000000",
//             },
//           },
//         },
//         MuiTextField: {
//           styleOverrides: {
//             root: {
//               marginTop: "10px",
//               marginBottom: "10px",
//             },
//           },
//         },
//         MuiButton: {
//           styleOverrides: {
//             root: {
//               borderRadius: "20px",
//               fontWeight: "bold",
//             },
//           },
//         },
//         MuiGrid: {
//           styleOverrides: {
//             root: {
//               margin: "10px 0",
//             },
//           },
//         },
//         MuiMenuItem: {
//           styleOverrides: {
//             root: {
//               borderRadius: "10px",
//             },
//           },
//         },
//         MuiBox: {
//           styleOverrides: {
//             root: {
//               border: mode === "dark" ? "1px solid #ffffff" : "1px solid #000000",
//               padding: "10px",
//               borderRadius: "10px",
//             },
//           },
//         },
//         MuiMenu: {
//           styleOverrides: {
//             paper: {
//               borderRadius: "10px",
//             },
//           },
//         },
//         MuiTooltip: {
//           styleOverrides: {
//             tooltip: {
//               backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
//               color: mode === "dark" ? "#ffffff" : "#000000",
//             },
//           },
//         },
//         MuiAvatar: {
//           styleOverrides: {
//             root: {
//               border: mode === "dark" ? "2px solid #ffffff" : "2px solid #000000",
//             },
//           },
//         },
//         MuiIconButton: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
//             },
//           },
//         },
//         MuiToolbar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
//             },
//           },
//         },
//         MuiAppBar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
//             },
//           },
//         },
//       },
//     });
//     setTheme(currentTheme);
//   }, [mode]);

//   const colorMode = {
//     toggleColorMode: () => {
//       setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
//     },
//   };

//   return (
//     <ThemeContext.Provider value={colorMode}>
//       {theme && <ThemeProvider theme={theme}>{children}</ThemeProvider>}
//     </ThemeContext.Provider>
//   );
// };

// CustomThemeProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
