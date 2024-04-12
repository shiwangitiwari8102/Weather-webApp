import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherData from './Component/WeatherData';
import CityTable from './Component/CityTable';
import Navbar from './Component/Navbar';
import { useParams } from 'react-router-dom';




const App: React.FC = () => {
  // Inside your functional component
const params = useParams<{ cityName: string }>();
  return (
    <Router>
     <Navbar></Navbar>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<CityTable />} />
          
          <Route path="/weather/:cityName" element={<WeatherData city={params.cityName ?? 'defaultCity'} />} />


          <Route path="/weather" element={<WeatherData city="defaultCity" />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
