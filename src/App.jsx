
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Transaction from "./Transaction/Transaction";
import TestTransaction from "./Transaction/TestTransaction";
import Withdraw from "./Transaction/Withdraw";

function App() {

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="p-4 space-y-8">
        {/* <TestTransaction /> */}
        <Transaction />
        <Withdraw />
      </div>
    </div>
  );
}

export default App;