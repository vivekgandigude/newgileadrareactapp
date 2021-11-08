import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import AppHome from "./pages/apphome";
import Header from "./UI/header";
import Sample from "./pages/sample";
import { Movies } from "./pages/movies";
import Employees from "./pages/employees";
import NewEmp from "./pages/newemp";
import DeleteEmp from "./pages/deleteemp";
import AllEmployees from './pages/allemployees'
import Olympics from "./pages/olympics";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={AppHome}></Route>
        <Route path="/home" exact component={Home}></Route>
        <Route path="/sample" exact component={Sample}></Route>
        <Route path="/movies" exact component={Movies}></Route>
        <Route path="/employees" exact component={Employees}></Route>
        <Route path="/allemployees" exact component={AllEmployees}></Route>
        <Route path="/employees/add" exact component={NewEmp}></Route>
        <Route path="/employees/delete/:id" exact component={DeleteEmp}></Route>
        <Route path="/olympics" exact component={Olympics}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
