import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  InputBase,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SearchIcon from "@mui/icons-material/Search";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md")); // Targets devices up to 960px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Targets devices up to 600px
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [mobileNavValue, setMobileNavValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleMobileNavChange = (event, newValue) => {
    setMobileNavValue(newValue);
    const paths = isAuthenticated
      ? ["/", "/dashboard", "/purchases", ""]
      : ["/", "/login", "/register"];
    if (newValue < paths.length) {
      navigate(paths[newValue]);
    }
    if (isAuthenticated && newValue === 3) {
      dispatch(logout());
    }
  };

  const navigationItems = isAuthenticated
    ? [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { label: "Purchases", icon: <ShoppingBasketIcon />, path: "/purchases" },
      ]
    : [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Login", icon: <LoginIcon />, path: "/login" },
        { label: "Register", icon: <AppRegistrationIcon />, path: "/register" },
      ];

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const executeSearch = () => {
    if (searchInput.trim()) {
      navigate(`/details/${searchInput.trim()}`);
      setSearchInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <>
      <AppBar
        position='static'
        sx={{ background: "linear-gradient(45deg, #796f6d 30%, #2f4d65 90%)", padding: "10px 0" }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
            }}
          >
            <Logo
              style={{ cursor: "pointer", maxWidth: "100%", height: "100px" }}
              alt='Asset Watch'
              onClick={() => navigate("/")}
            />
            {!isTabletOrMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {navigationItems.map((item, index) => (
                  <Button
                    key={index}
                    color='inherit'
                    onClick={() => navigate(item.path)}
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {item.label}
                  </Button>
                ))}
                {isAuthenticated && (
                  <Button
                    color='inherit'
                    onClick={() => {
                      dispatch(logout());
                      navigate("/");
                    }}
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Logout
                  </Button>
                )}
                <InputBase
                  placeholder='Search...'
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  value={searchInput}
                  sx={{
                    ml: 2,
                    color: "inherit",
                    border: "1px solid white",
                    padding: "2px 10px",
                    borderRadius: "4px",
                    width: 250,
                    fontSize: "1rem",
                  }}
                />
                <IconButton onClick={executeSearch} sx={{ color: "inherit" }} aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {(isMobile || isTabletOrMobile) && (
        <Box sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 1300 }}>
          <BottomNavigation value={mobileNavValue} onChange={handleMobileNavChange} showLabels>
            {navigationItems.map((item, index) => (
              <BottomNavigationAction
                key={index}
                label={item.label}
                icon={item.icon}
                onClick={() => navigate(item.path)}
              />
            ))}
            {isAuthenticated && (
              <BottomNavigationAction
                label='Logout'
                icon={<ExitToAppIcon />}
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              />
            )}
          </BottomNavigation>
        </Box>
      )}
    </>
  );
};

export default NavBar;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice";
// import {
//   AppBar,
//   Box,
//   Button,
//   Container,
//   Toolbar,
//   useTheme,
//   useMediaQuery,
//   BottomNavigation,
//   BottomNavigationAction,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import LoginIcon from "@mui/icons-material/Login";
// import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
// import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

// const NavBar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const [mobileNavValue, setMobileNavValue] = useState(0);

//   const handleMobileNavChange = (event, newValue) => {
//     setMobileNavValue(newValue);
//     const paths = isAuthenticated
//       ? ["/", "/dashboard", "/purchases", ""]
//       : ["/", "/login", "/register"];
//     if (newValue < paths.length) {
//       navigate(paths[newValue]);
//     }
//     if (isAuthenticated && newValue === 3) {
//       dispatch(logout());
//     }
//   };

//   const navigationItems = isAuthenticated
//     ? [
//         // { label: "Home", icon: <HomeIcon />, path: "/" },
//         { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
//         { label: "Purchases", icon: <ShoppingBasketIcon />, path: "/purchases" },
//       ]
//     : [
//         { label: "Home", icon: <HomeIcon />, path: "/" },
//         { label: "Login", icon: <LoginIcon />, path: "/login" },
//         { label: "Register", icon: <AppRegistrationIcon />, path: "/register" },
//       ];

//   return (
//     <>
//       <AppBar
//         position='static'
//         sx={{ background: "linear-gradient(45deg, #796f6d 30%, #2f4d65 90%)", padding: "10px 0" }}
//       >
//         <Container maxWidth='xl'>
//           <Toolbar
//             disableGutters
//             sx={{
//               justifyContent: "space-between",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//             }}
//           >
//             <Logo
//               style={{
//                 marginLeft: isMobile ? "auto" : "10",
//                 marginRight: isMobile ? "auto" : undefined,
//                 height: "100px",
//                 cursor: "pointer",
//                 maxWidth: "100%",
//               }}
//               alt='Asset Watch'
//               onClick={() => navigate("/")}
//             />
//             {!isMobile && (
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 {navigationItems.map((item, index) => (
//                   <Button key={index} color='inherit' onClick={() => navigate(item.path)}>
//                     {item.label}
//                   </Button>
//                 ))}
//                 {isAuthenticated && (
//                   <Button
//                     color='inherit'
//                     onClick={() => {
//                       dispatch(logout());
//                       navigate("/");
//                     }}
//                   >
//                     Logout
//                   </Button>
//                 )}
//               </Box>
//             )}
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {isMobile && (
//         <Box sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 1300 }}>
//           <BottomNavigation value={mobileNavValue} onChange={handleMobileNavChange} showLabels>
//             {navigationItems.map((item, index) => (
//               <BottomNavigationAction
//                 key={index}
//                 label={item.label}
//                 icon={item.icon}
//                 onClick={() => navigate(item.path)}
//               />
//             ))}
//             {isAuthenticated && (
//               <BottomNavigationAction
//                 label='Logout'
//                 icon={<ExitToAppIcon />}
//                 onClick={() => {
//                   dispatch(logout());
//                   navigate("/");
//                 }}
//               />
//             )}
//           </BottomNavigation>
//         </Box>
//       )}
//     </>
//   );
// };

// export default NavBar;
