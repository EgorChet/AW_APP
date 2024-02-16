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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [mobileNavValue, setMobileNavValue] = useState(0);

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
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { label: "Purchases", icon: <ShoppingBasketIcon />, path: "/purchases" },
      ]
    : [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Login", icon: <LoginIcon />, path: "/login" },
        { label: "Register", icon: <AppRegistrationIcon />, path: "/register" },
      ];

  return (
    <>
      <AppBar
        position='static'
        sx={{ background: "linear-gradient(45deg, #796f6d 30%, #2f4d65 90%)", padding: "10px 0" }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", flexDirection: isMobile ? "column" : "row" }}
          >
            <Logo
              style={{
                justifyContent: "flexstart",
                height: "100px",
                cursor: "pointer",
                maxWidth: "100%",
                margin: "0 auto",
              }}
              alt='Asset Watch'
              onClick={() => navigate("/")}
            />
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {navigationItems.map((item, index) => (
                  <Button key={index} color='inherit' onClick={() => navigate(item.path)}>
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
                  >
                    Logout
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {isMobile && (
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
