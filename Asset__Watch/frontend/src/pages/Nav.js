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
import ThemeSwitch from "../components/ThemeSwitch"; // Adjust this path as necessary

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Logo
                style={{ cursor: "pointer", maxWidth: "100%", height: "100px" }}
                alt='Asset Watch'
                onClick={() => navigate("/")}
              />
              {/* Include ThemeSwitch for mobile and tablet layouts here if you want it next to the logo */}
              {(isMobile || isTablet) && <ThemeSwitch />}
            </Box>
            {isAuthenticated && (isMobile || isTablet) && (
              <Box sx={{ width: "100%", mt: 2, display: "flex", justifyContent: "center" }}>
                <InputBase
                  placeholder='Search...'
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  value={searchInput}
                  sx={{
                    color: "inherit",
                    border: "1px solid white",
                    padding: "2px 10px",
                    borderRadius: "4px",
                    width: isTablet ? "50%" : "80%",
                    textAlign: "center",
                  }}
                />
                <IconButton
                  onClick={executeSearch}
                  sx={{ color: "inherit", ml: 1 }}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            )}
            {!isMobile && !isTablet && (
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
                  <>
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
                    {/* Include ThemeSwitch for desktop layouts here */}
                    <ThemeSwitch />
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
                    <IconButton
                      onClick={executeSearch}
                      sx={{ color: "inherit" }}
                      aria-label='search'
                    >
                      <SearchIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {(isMobile || isTablet) && (
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
