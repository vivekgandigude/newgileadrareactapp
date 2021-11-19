import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AppHome from "./pages/apphome";
import Header from "./UI/header";
import Sales from "./pages/sales";
import Olympics from "./pages/olympics";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={AppHome}></Route>
        <Route path="/olympics" exact component={Olympics}></Route>
        <Route path="/sales" exact component={Sales}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
