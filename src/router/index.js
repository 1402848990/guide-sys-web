import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Layout from "@/views/layout";
import Login from "@/views/login";
import Cookie from 'js-cookie'
class Router extends React.Component {
  render() {
    const userInfo = Cookie.get('userInfo')
    console.log('router-userInfo',userInfo)
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route
            path="/"
            render={() => {
              if (!userInfo) {
                return <Redirect to="/login" />;
              } else {
                 return <Layout />;
              }
            }}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default Router
