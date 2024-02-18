import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  selectIsAuthenticated,
  selectCurrentUser,
} from "./features/auth/authSlice";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import NavBar from "./pages/Nav";
import DashboardPage from "./pages/Dashboard";
import PurchasesList from "./pages/PurchasesList";
import { CustomThemeProvider } from "./themeContext";
import Footer from "./pages/Footer";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";
import PublicRoute from "./components/PublicRoute";
import { Box } from "@mui/material";
import StockDetails from "./pages/StockDetails";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [dispatch, isAuthenticated, currentUser?.id]);

  // Correct usage of useTheme within the component body after correcting the import
  const theme = useTheme();

  return (
    <CustomThemeProvider>
      <Box
        className='App'
        display='flex'
        flexDirection='column'
        minHeight='100vh'
        sx={{ bgcolor: theme.palette.background.default }}
      >
        <NavBar />
        <Box component='main' flexGrow={1}>
          <TransitionGroup>
            <CSSTransition key={location.key} classNames='fade' timeout={300}>
              <Routes location={location}>
                <Route path='/home' element={<HomePage />} />
                <Route
                  path='/login'
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path='/register'
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />
                {/* <Route path='/profile' element={<ProfilePage />} /> */}
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/purchases' element={<PurchasesList />} />
                <Route path='/details/:symbol' element={<StockDetails />} />
                <Route path='*' element={<Navigate to='/home' replace />} />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
        </Box>
        <Footer />
      </Box>
    </CustomThemeProvider>
  );
}

export default App;
