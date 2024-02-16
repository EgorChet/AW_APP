import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  selectIsAuthenticated,
  selectCurrentUser,
} from "./features/auth/authSlice";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
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
      // Fetch user profile only if authenticated and user ID is available
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [dispatch, isAuthenticated, currentUser?.id]);

  return (
    <CustomThemeProvider>
      <Box className='App' display='flex' flexDirection='column' minHeight='100vh'>
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
            <Route path='/profile' element={<ProfilePage />} />
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

// import React, { useEffect } from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUserProfile,
//   selectIsAuthenticated,
//   selectCurrentUser,
// } from "./features/auth/authSlice";
// import LoginPage from "./pages/Login";
// import ProfilePage from "./pages/Profile";
// import RegisterPage from "./pages/Register";
// import HomePage from "./pages/Home";
// import NavBar from "./pages/Nav";
// import DashboardPage from "./pages/Dashboard";
// import PurchasesList from "./pages/PurchasesList";
// import { CustomThemeProvider } from "./themeContext";
// import Footer from "./pages/Footer";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import "./App.css";
// import PublicRoute from "./components/PublicRoute";

// function App() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const currentUser = useSelector(selectCurrentUser);
//   const location = useLocation();

//   useEffect(() => {
//     if (isAuthenticated && currentUser?.id) {
//       // Fetch user profile only if authenticated and user ID is available
//       dispatch(fetchUserProfile(currentUser.id));
//     }
//   }, [dispatch, isAuthenticated, currentUser?.id]);

//   return (
//     <CustomThemeProvider>
//       <div className='App'>
//         <NavBar />
//         <TransitionGroup>
//           <CSSTransition key={location.key} classNames='fade' timeout={300}>
//             <Routes location={location}>
//               <Route path='/home' element={<HomePage />} />
//               <Route
//                 path='/login'
//                 element={
//                   <PublicRoute>
//                     <LoginPage />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path='/register'
//                 element={
//                   <PublicRoute>
//                     <RegisterPage />
//                   </PublicRoute>
//                 }
//               />
//               <Route path='/profile' element={<ProfilePage />} />
//               <Route path='/dashboard' element={<DashboardPage />} />
//               <Route path='/purchases' element={<PurchasesList />} />
//               <Route path='*' element={<Navigate to='/home' replace />} />
//             </Routes>
//           </CSSTransition>
//         </TransitionGroup>
//         <Footer />
//       </div>
//     </CustomThemeProvider>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import LoginPage from "./pages/Login";
// import ProfilePage from "./pages/Profile";
// import RegisterPage from "./pages/Register";
// import HomePage from "./pages/Home";
// import NavBar from "./pages/Nav";
// import DashboardPage from "./pages/Dashboard";
// import { CustomThemeProvider } from "./themeContext";
// import Footer from "./pages/Footer";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import "./App.css";
// import { useDispatch, useSelector } from "react-redux";
// import { checkAuthState, fetchUserProfile, selectIsAuthenticated } from "./features/auth/authSlice";
// import PurchasesList from "./pages/PurchasesList";
// import { selectCurrentUser } from "./features/auth/authSlice";

// function App() {
//   const dispatch = useDispatch();
//   const [authChecked, setAuthChecked] = useState(false);
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const currentUser = useSelector(selectCurrentUser);
//   const location = useLocation();

//   useEffect(() => {
//     dispatch(checkAuthState())
//       .then(() => {
//         if (isAuthenticated) {
//           const userId = currentUser?.id;
//           if (userId) {
//             dispatch(fetchUserProfile(userId));
//           }
//         }
//       })
//       .finally(() => {
//         setAuthChecked(true);
//       });
//   }, [dispatch, isAuthenticated]);

//   if (!authChecked) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <CustomThemeProvider>
//       <div className='App'>
//         <NavBar />
//         <TransitionGroup>
//           <CSSTransition key={location.key} timeout={300} classNames='fade'>
//             <Routes location={location}>
//               <Route path='/home' element={<HomePage />} />
//               <Route path='/login' element={<LoginPage />} />
//               <Route path='/register' element={<RegisterPage />} />
//               <Route path='/profile' element={<ProfilePage />} />
//               <Route path='/dashboard' element={<DashboardPage />} />
//               <Route path='/purchases' element={<PurchasesList />} />
//               <Route path='*' element={<Navigate to='/home' replace />} />
//             </Routes>
//           </CSSTransition>
//         </TransitionGroup>
//         <Footer />
//       </div>
//     </CustomThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import LoginPage from "./pages/Login";
// import ProfilePage from "./pages/Profile";
// import RegisterPage from "./pages/Register";
// import HomePage from "./pages/Home";
// import NavBar from "./pages/Nav";
// import DashboardPage from "./pages/Dashboard";
// import { CustomThemeProvider } from "./themeContext";
// import Footer from "./pages/Footer";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import "./App.css";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { checkAuthState } from "./features/auth/authSlice";
// import PurchasesList from "./pages/PurchasesList";

// function App() {
//   const dispatch = useDispatch();
//   const [authChecked, setAuthChecked] = useState(false); // State to track if auth check has been done
//   const location = useLocation(); // Get the current location

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       dispatch(checkAuthState()).finally(() => {
//         setAuthChecked(true); // Set true after the auth check action is dispatched
//       });
//     } else {
//       setAuthChecked(true); // Also set true if no token to handle anonymous users
//     }
//   }, [dispatch]);

//   if (!authChecked) {
//     // Optionally, show a loading indicator or return null to wait until the check is complete
//     return <div>Loading...</div>;
//   }

//   return (
//     <CustomThemeProvider>
//       <div className='App'>
//         <NavBar />
//         <TransitionGroup>
//           <CSSTransition key={location.key} timeout={300} classNames='fade'>
//             <Routes location={location}>
//               <Route path='/home' element={<HomePage />} />
//               <Route path='/login' element={<LoginPage />} />
//               <Route path='/register' element={<RegisterPage />} />
//               <Route path='/profile' element={<ProfilePage />} />
//               <Route path='/dashboard' element={<DashboardPage />} />
//               <Route path="/purchases" element={<PurchasesList />} />
//               {/* Catch-all route - redirects to Home page for any unmatched routes */}
//               <Route path='*' element={<Navigate to='/home' replace />} />
//               {/* Add more routes here as needed */}
//             </Routes>
//           </CSSTransition>
//         </TransitionGroup>
//         <Footer />
//       </div>
//     </CustomThemeProvider>
//   );
// }

// export default App;

// import "./App.css";
// import { Routes, Route } from "react-router-dom";
// import LoginRegister from "./pages/LoginRegister";
// import Home from "./pages/Home";
// import Nav from "./pages/Nav";
// import Auth from "./auth/Auth";
// import Info from "./pages/Info";
// import { useState, useContext, createContext } from "react"; //USE REDUX INSTEAD OF useContext

// export const AuthContext = createContext();

// function App() {
//   const [token, setToken] = useState();
//   return (
//     <AuthContext.Provider value={{ token, setToken }}>
//       {/* Redux provider store provider instead */}
//       <div className='App'>
//         <Nav />
//         <Routes>
//           <Route path='/' element={<Home />} />
//           <Route path='/login' element={<LoginRegister page={"Login"} />} />
//           <Route path='/register' element={<LoginRegister page={"Register"} />} />

//           <Route
//             path='/info'
//             element={
//               <Auth>
//                 <Info />
//               </Auth>
//             }
//           />
//         </Routes>
//       </div>
//     </AuthContext.Provider>
//   );
// }

// export default App;
