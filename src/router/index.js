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
              // 如果cookie中没有用户信息，则跳转到登录页面
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
