import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkUserType } from "../Network/NetworkManager";

const UserRoute = ({ component: RouteComponent, ...rest }) => {
  const isUser = checkUserType() === '0' || checkUserType() === null
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!isUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={checkUserType() === '1' ? "/volunteer" : checkUserType() === '2' ? "/homeAdmin" : "/login"} />
        )
      }
    />
  );
};


export default UserRoute