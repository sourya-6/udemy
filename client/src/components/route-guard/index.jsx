import PropTypes from 'prop-types';  // Import PropTypes
import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  // Optional: Add loading check if needed
  if (authenticated === undefined) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }

  // Redirect unauthenticated users to /auth unless the path is /auth
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  // Redirect non-instructors from instructor-specific routes
  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") || location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  // Redirect instructors to the instructor route if they're trying to access a non-instructor route
  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  // Default: render the element passed as prop
  return <Fragment>{element}</Fragment>;
}

// Define PropTypes for the RouteGuard component
RouteGuard.propTypes = {
  authenticated: PropTypes.bool.isRequired,  // authenticated should be a boolean
  user: PropTypes.object,         // user should be an object
  element: PropTypes.node.isRequired,        // element should be a React element (node)
};

export default RouteGuard;
