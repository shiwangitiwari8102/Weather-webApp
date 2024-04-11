import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherData from './Component/WeatherData';
import CityTable from './Component/CityTable';
import Navbar from './Component/Navbar';

const App: React.FC = () => {
  return (
    <Router>
     <Navbar></Navbar>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<CityTable />} />
          <Route path="/weather/:cityName" element={<WeatherData/>} />
          <Route path="/weather" element={<WeatherData />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
