import React from 'react';
import './App.css';
import { Header } from './layout/Header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
function App() {
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
