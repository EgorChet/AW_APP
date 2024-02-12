import React, { useState } from "react";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  Button,
  Box,
  MenuItem,
  Menu,
  Tooltip,
  Avatar,
  Typography,
  IconButton,
  Toolbar,
  Container,
  AppBar,
} from "@mui/material";
import ThemeSwitch from "../components/ThemeSwitch";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate("/");
  };

  const pages = isAuthenticated ? [] : ["Home", "Login", "Register"];
  const settings = ["Home", "Profile", "Dashboard", "Logout"];

  return (
    <AppBar
      position='static'
      sx={{ background: "linear-gradient(45deg, #796f6d 30%, #2f4d65 90%)" }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            component={RouterLink}
            to='/home'
          >
            <Logo style={{ height: "100px" }} alt='Asset Watch' />
          </IconButton>
          {/* Place ThemeSwitch Here */}
          <ThemeSwitch />
          <Box
            sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" }, justifyContent: "flex-end" }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLowerCase()}`)}
                sx={{
                  fontFamily: "Roboto",
                  fontSize: 20,
                  mr: 10,
                  mt: 2,
                  my: 2,
                  color: "white",
                  display: "block",
                }}
              >
                {page}
              </Button>
            ))}
            {/* Place ThemeSwitch Here
            <ThemeSwitch /> */}
          </Box>

          {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt='User'
                    src='https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png'
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  backgroundColor: "linear-gradient(45deg, #123456 30%, #FF8E53 90%)",
                }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        handleLogout();
                      } else {
                        navigate(`/${setting.toLowerCase()}`);
                      }
                    }}
                  >
                    <Typography textAlign='center'>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;

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
