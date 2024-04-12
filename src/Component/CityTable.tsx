import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WeatherData from './WeatherData'; 

interface City {
  geoname_id: string;
  name: string;
  population: number;
  cou_name_en: string;
  country_code: string;
  timezone: string;
}

const CityTable: React.FC = () => {
  const apiKey = "e8c24597158bcaa170b724112df7498f"; 
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null); 
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await axios.get('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100');
        setCities(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching city data:', error);
        setError('Error fetching city data');
      }
    };

    fetchCityData();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (loading || cities.length === 0) return;

    const node = document.getElementById('observer-node');
    if (node) {
      observer.current.observe(node);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, cities]);

  const handleObserver: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting) {
     
      fetchMoreCities();
    }
  };

  const fetchMoreCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${cities.length}`);
      setCities(prevCities => [...prevCities, ...response.data.results]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching more city data:', error);
      setError('Error fetching more city data');
    }
  };

  // Handle city click
  const handleCityClick = async (cityName: string) => {
    setSelectedCity(cityName); // Set the selected city
    try {
      // Fetch weather data for the selected city
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
      setWeatherData(response.data); // Set the fetched weather data
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter cities based on search query
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="city-data-table">
      <h2 className='text-white text-center'>Geonames - All Cities with a population</h2>
      <div className="search-bar">
        <input type="text" placeholder="Search city..." value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="table-responsive">
        <table className="table table-success table-striped">
          <thead style={{ color: 'white' }} className="table-dark">
            <tr>
              <th>Name</th>
              <th>Population</th>
              <th>Country</th>
              <th>Country code</th>
              <th>Time Zone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city: City) => (
              <tr key={city.name}>
                <td style={{ fontFamily: 'Georgia, serif' }}>
                  {/* Link to the weather route with the city name */}
                  <Link to={`/weather/${city.geoname_id}`} onClick={() => handleCityClick(city.name)} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bolder' }}>
                    {city.name}
                  </Link>
                </td>
                <td>{city.population}</td>
                <td>{city.cou_name_en}</td>
                <td>{city.country_code}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'red' }}>{error}</td>
              </tr>
            )}
            <tr id="observer-node"></tr>
          </tbody>
        </table>
      </div>
      {/* Render WeatherData component if weatherData is available */}
      {selectedCity && weatherData && <WeatherData city={selectedCity} weatherData={weatherData} />}
    </div>
  );
};

export default CityTable;
