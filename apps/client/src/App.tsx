import SearchField from './components/SearchField';
import FunctionsList from './components/FunctionsList';
import ChainSelector from './components/ChainSelector';
import Connect from './components/Connect';
import { useShowFunctions } from './stores/useUiPanelStore';

function App() {
  const showFunctions = useShowFunctions();
  return (
    <div className="app-container">
      <div className="top-bar">
        <ChainSelector />
        <Connect />
      </div>
      <header className="hero">
        <h1 className="hero-title">ABI Plug & Play</h1>
        <div className="hero-search">
          <SearchField />
        </div>
      </header>
      {showFunctions && <FunctionsList />}
    </div>
  );
}

export default App;
