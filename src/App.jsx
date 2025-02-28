import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Transaction from "./Transaction/Transaction";

function App() {

  return (
    <div className="App">
      <Navbar />
      <Transaction />
    </div>
  );
}

export default App;