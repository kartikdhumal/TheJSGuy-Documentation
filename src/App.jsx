import React from "react";
import './index.css';
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Navigation from "./Components/Navigation";


function App() {
  return (
    <div>
      <Navbar/>
      <Navigation/>
    </div>
  );
}

export default App;
