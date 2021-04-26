import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkUserType } from "../Network/NetworkManager";

const VolunteerRoute = ({ component: RouteComponent, ...rest }) => {
  const isVolunteer = checkUserType() === '1'
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!isVolunteer ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};


export default VolunteerRoute