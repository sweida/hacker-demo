import React, { Component } from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
// import NotFound from "component/notFound";
import router from "router/index";
import history from "router/history";


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        {/* 路由拦截 */}
        <Router history={history}>
          <Switch>
            {router.map((item, index) => {
              return (
                <Route key={index} path={item.path} exact render={props =>
                    <item.component {...props} />
                  }
                />
              );
            })}
            {/* <Route component={NotFound} /> */}
          </Switch>
        </Router>
      </BrowserRouter>
    );
  }
}

export default App;
