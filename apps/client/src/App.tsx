import SearchField from './components/SearchField';
import FunctionsList from './components/FunctionsList';
import ChainSelector from './components/ChainSelector';
import Connect from './components/Connect';
import Notification from './components/Notification';
import { Route, Routes, Link } from 'react-router-dom';

function App() {

  return (
    <div className="app-container">
      <div className="top-bar">
        <ChainSelector />
        <Connect />
      </div>
      <header className="hero">
        <Notification />
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <h1 className="hero-title">ABI Plug & Play</h1>
        </Link>
        <div className="hero-search">
          <SearchField />
        </div>
      </header>
      <Routes>
        <Route path={'/:chainId/:contractAddress'} element={<FunctionsList />} />
      </Routes>
    </div>
  );
}

export default App;
