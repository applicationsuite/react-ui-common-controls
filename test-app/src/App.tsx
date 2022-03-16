import React from 'react';
import './App.css';
import { Header } from './layout/Header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { useFile } from 'react-ui-common-controls';

function App() {
  const appConfig: any = useFile('app.config.json');
  if (!appConfig) {
    return null;
  }
  return (
    <div className="container">
      <Router>
        <Header />
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
