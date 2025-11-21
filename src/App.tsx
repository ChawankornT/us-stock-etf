import "./App.css";
import { SymbolProvider } from "./context/SymbolContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <SymbolProvider>
      <Dashboard />
    </SymbolProvider>
  );
}

export default App;
