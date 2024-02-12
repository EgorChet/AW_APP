import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import NavBar from "./pages/Nav";
import DashboardPage from "./pages/Dashboard";
import { CustomThemeProvider } from "./themeContext";
import Footer from "./pages/Footer";

function App() {

  return (
    <CustomThemeProvider>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
        <Footer />
      </div>
    </CustomThemeProvider>
  );
}

export default App;

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
