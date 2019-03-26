import React from "react";
import { Router as MainRouter, Switch, Route } from "react-router-dom";
import { Landing, Register, Dashboard, Login } from "client/views";
import { Props, State } from "client/interfaces";
import history from "./history";

class Router extends React.Component<Props, State> {
  render() {
    return (
      <MainRouter history={history}>
        <div>
          <Switch>
            <Route exact path="/" render={() => <Landing />} />
            <Route path="/register" render={() => <Register />} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/app" render={() => <Dashboard />} />
          </Switch>
        </div>
      </MainRouter>
    );
  }
}
export default Router;
