import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import PropTypes from "prop-types"; // Import PropTypes
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    // Redirect them to the dashboard or home page
    return <Navigate to='/dashboard' replace />;
  }

  return children;
}

// Define PropTypes for PublicRoute
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired, // Defines children as a required prop
};

export default PublicRoute;
