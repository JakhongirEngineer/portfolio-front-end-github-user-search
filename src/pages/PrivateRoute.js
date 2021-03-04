import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, ...rest }) => {
  const { isAuthenticated, user } = useAuth0();
  const isUserAuthenticated = isAuthenticated && user;

  return (
    <Route
      {...rest}
      render={() => {
        return isUserAuthenticated ? children : <Redirect to="/login" />;
      }}
    ></Route>
  );
};
export default PrivateRoute;
