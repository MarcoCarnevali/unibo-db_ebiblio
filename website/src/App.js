import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Detail from "./Detail";
import Login from "./Login";
import LoginAdmin from "./admin/LoginAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import Signup from "./Signup";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import BookingHome from "./BookingHome";
import { AuthProvider } from "./auth/Auth"
import AdminRoute from "./routes/AdminRoute";
import VolunteerRoute from "./routes/VolunteerRoute";
import UserRoute from "./routes/UserRoute";
import UserLoggedRoute from "./routes/UserLoggedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <UserRoute exact path={process.env.PUBLIC_URL + '/'} component={Home} />
          <Route exact path={process.env.PUBLIC_URL + '/leaderboard'} component={Leaderboard} />
          <VolunteerRoute exact path={process.env.PUBLIC_URL + '/volunteer'} component={BookingHome} />
          <UserRoute exact path={process.env.PUBLIC_URL + '/detail'} component={Detail} />
          <UserLoggedRoute exact path={process.env.PUBLIC_URL + '/profile'} component={Profile} />
          <Route exact path={process.env.PUBLIC_URL + '/login'} component={Login} />
          <Route exact path={process.env.PUBLIC_URL + '/signup'} component={Signup} />
          <Route exact path={process.env.PUBLIC_URL + '/loginAdmin'} component={LoginAdmin} />
          <AdminRoute exact path={process.env.PUBLIC_URL + '/adminDashboard'} component={AdminDashboard} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
