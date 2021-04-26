import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { checkUserType } from "../Network/NetworkManager";

const AdminRoute = ({ component: RouteComponent, ...rest }) => {
  const isAdmin = checkUserType() === '2'
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!isAdmin ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/loginAdmin"} />
        )
      }
    />
  );
};


export default AdminRoute