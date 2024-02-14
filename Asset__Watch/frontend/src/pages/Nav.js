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
import LoginIcon from "@mui/icons-material/Login"; // Import login icon
import AppRegistrationIcon from "@mui/icons-material/AppRegistration"; // Import registration icon
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
    // Adjust navigation based on the selected tab and authentication state
    const paths = isAuthenticated
      ? ["/", "/dashboard", "/purchases", ""]
      : ["/", "/login", "/register"];
    const action =
      isAuthenticated && newValue === 3
        ? () => dispatch(logout())
        : () => navigate(paths[newValue]);
    action();
  };

  // Adjust navigation items based on authentication state
  const navigationItems = isAuthenticated
    ? [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { label: "Purchases", icon: <ShoppingBasketIcon />, path: "/purchases" },
        { label: "Logout", icon: <ExitToAppIcon />, action: () => dispatch(logout()) },
      ]
    : [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Login", icon: <LoginIcon />, path: "/login" },
        { label: "Register", icon: <AppRegistrationIcon />, path: "/register" },
      ];

  const handleNavigation = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
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
            sx={{ justifyContent: "space-between", flexDirection: isMobile ? "column" : "row" }}
          >
            <Logo
              style={{ height: "100px", maxWidth: "100%", margin: "0 auto", cursor: "pointer" }}
              alt='Asset Watch'
              onClick={() => navigate("/")}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {navigationItems.map((item) => (
                <Button key={item.label} color='inherit' onClick={() => handleNavigation(item)}>
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Bottom Navigation for Mobile Devices */}
      {isMobile && (
        <Box sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 1300 }}>
          <BottomNavigation value={mobileNavValue} onChange={handleMobileNavChange} showLabels>
            {navigationItems.map((item, index) => (
              <BottomNavigationAction
                key={index}
                label={item.label}
                icon={item.icon}
                onClick={() => handleNavigation(item)}
              />
            ))}
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
//     // Navigate based on the selected tab
//     switch (newValue) {
//       case 0:
//         navigate("/");
//         break;
//       case 1:
//         navigate("/dashboard");
//         break;
//       case 2:
//         navigate("/purchases");
//         break;
//       case 3:
//         dispatch(logout());
//         navigate("/");
//         break;
//       default:
//         navigate("/");
//     }
//   };

//   // Define navigation actions for desktop and mobile
//   const navigationItems = [
//     { label: "Home", icon: <HomeIcon />, path: "/" },
//     { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
//     { label: "Purchases", icon: <ShoppingBasketIcon />, path: "/purchases" },
//   ];

//   const handleDesktopNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <>
//       <AppBar
//         position='static'
//         sx={{ background: "linear-gradient(45deg, #796f6d 30%, #2f4d65 90%)", padding: "10px 0" }}
//       >
//         <Container maxWidth='xl'>
//           <Toolbar
//             disableGutters
//             sx={{ justifyContent: "space-between", flexDirection: isMobile ? "column" : "row" }}
//           >
//             <Logo
//               style={{ height: "80px", cursor: "pointer" }}
//               alt='Asset Watch'
//               onClick={() => navigate("/")}
//             />
//             {!isMobile && (
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 {navigationItems.map((item) => (
//                   <Button
//                     key={item.label}
//                     color='inherit'
//                     onClick={() => handleDesktopNavigation(item.path)}
//                   >
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

//       {/* Bottom Navigation for Mobile Devices */}
//       {isMobile && isAuthenticated && (
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
//             <BottomNavigationAction
//               label='Logout'
//               icon={<ExitToAppIcon />}
//               onClick={() => {
//                 dispatch(logout());
//                 navigate("/");
//               }}
//             />
//           </BottomNavigation>
//         </Box>
//       )}
//     </>
//   );
// };

// export default NavBar;

// import React, { useState } from "react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice"; // Adjust the import path as needed
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Drawer from "@mui/material/Drawer";
// import ThemeSwitch from "../components/ThemeSwitch";
// import { styled, useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

// const CustomButton = styled(Button)(({ theme }) => ({
//   color: theme.palette.getContrastText(theme.palette.background.paper),
//   marginLeft: theme.spacing(1),
//   "&:hover": {
//     backgroundColor: theme.palette.primary.light,
//   },
// }));

// const NavBar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   const drawer = (
//     <div>
//       <CustomButton component={RouterLink} to='/'>
//         Home
//       </CustomButton>
//       {isAuthenticated ? (
//         <>
//           <CustomButton component={RouterLink} to='/dashboard'>
//             Dashboard
//           </CustomButton>
//           <CustomButton onClick={handleLogout}>Logout</CustomButton>
//         </>
//       ) : (
//         <>
//           <CustomButton component={RouterLink} to='/login'>
//             Login
//           </CustomButton>
//           <CustomButton component={RouterLink} to='/register'>
//             Register
//           </CustomButton>
//         </>
//       )}
//       <ThemeSwitch />
//     </div>
//   );

//   return (
//     <AppBar position='static' color='primary' sx={{ boxShadow: "none" }}>
//       <Toolbar sx={{ justifyContent: "space-between" }}>
//         <Typography
//           variant='h6'
//           component='div'
//           sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
//         >
//           <img
//             src='https://assetwatch.io/cdn/shop/files/logo_assetwatch_schwarz.svg?v=1679242397'
//             alt='Asset Watch'
//             style={{ height: "100px", marginRight: "10px" }}
//           />{" "}
//         </Typography>
//         {isMobile ? (
//           <>
//             <IconButton
//               color='inherit'
//               aria-label='open drawer'
//               edge='end'
//               onClick={handleDrawerToggle}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Drawer anchor='right' open={mobileOpen} onClose={handleDrawerToggle}>
//               {drawer}
//             </Drawer>
//           </>
//         ) : (
//           <div>{drawer}</div>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;

// import React from "react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice"; // Adjust the import path as needed
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import ThemeSwitch from "../components/ThemeSwitch";
// import { styled } from "@mui/material/styles";

// const CustomButton = styled(Button)(({ theme }) => ({
//   color: theme.palette.getContrastText(theme.palette.background.paper),
//   marginLeft: theme.spacing(1),
//   "&:hover": {
//     backgroundColor: theme.palette.primary.light,
//   },
// }));

// const NavBar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <AppBar position='static' color='primary' sx={{ boxShadow: "none" }}>
//       <Toolbar sx={{ justifyContent: "space-between" }}>
//         <Typography variant='h6' component='div' sx={{ flexGrow: 1, color: "white" }}>
//           Asset Watch
//         </Typography>
//         <div>
//           <CustomButton component={RouterLink} to='/'>
//             Home
//           </CustomButton>
//           {isAuthenticated ? (
//             <>
//               <CustomButton component={RouterLink} to='/dashboard'>
//                 Dashboard
//               </CustomButton>
//               <CustomButton onClick={handleLogout}>Logout</CustomButton>
//             </>
//           ) : (
//             <>
//               <CustomButton component={RouterLink} to='/login'>
//                 Login
//               </CustomButton>
//               <CustomButton component={RouterLink} to='/register'>
//                 Register
//               </CustomButton>
//             </>
//           )}
//           <ThemeSwitch />
//         </div>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;
