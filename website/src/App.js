import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Detail from "./Detail";
import Login from "./Login";
import Signup from "./Signup";
import BookingHome from "./BookingHome";
import { AuthProvider } from "./auth/Auth"
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
          <Route exact path={process.env.PUBLIC_URL + '/volunteer'} component={BookingHome} />
          <Route exact path={process.env.PUBLIC_URL + '/detail'} component={Detail} />
          <Route exact path={process.env.PUBLIC_URL + '/login'} component={Login} />
          <Route exact path={process.env.PUBLIC_URL + '/signup'} component={Signup} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
