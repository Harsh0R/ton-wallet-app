
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Transaction from "./Transaction/Transaction";
import TestTransaction from "./Transaction/TestTransaction";

function App() {

  return (
    <div className="App">
      <Navbar />
      <Transaction />
      <TestTransaction />
    </div>
  );
}

export default App;