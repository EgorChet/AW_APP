import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Adjust the import path as needed
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ThemeSwitch from "../components/ThemeSwitch";
import { styled } from "@mui/material/styles";

const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.paper),
  marginLeft: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position='static' color='primary' sx={{ boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1, color: "white" }}>
          Asset Watch
        </Typography>
        <div>
          <CustomButton component={RouterLink} to='/'>
            Home
          </CustomButton>
          {isAuthenticated ? (
            <>
              <CustomButton component={RouterLink} to='/dashboard'>
                Dashboard
              </CustomButton>
              <CustomButton onClick={handleLogout}>Logout</CustomButton>
            </>
          ) : (
            <>
              <CustomButton component={RouterLink} to='/login'>
                Login
              </CustomButton>
              <CustomButton component={RouterLink} to='/register'>
                Register
              </CustomButton>
            </>
          )}
          <ThemeSwitch />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
