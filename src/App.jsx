
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Transaction from "./Transaction/Transaction";
import TestTransaction from "./Transaction/TestTransaction";

function App() {

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="p-4 space-y-8">
        <TestTransaction />
        <Transaction />
      </div>
    </div>
  );
}

export default App;