import NavBar from './components/NavBar';
import RoutesList from './RoutesList';

import './App.css';

// ==================================================

function App() {
  return (
    <div className="App">
      <NavBar isLoggedIn={true} />
      <RoutesList />
    </div>
  );
}

// ==================================================

export default App;
