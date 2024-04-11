import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap'; // Importing React Bootstrap components

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface Weather {
  name: string;
  main: {
    temp: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface WeatherDataProps {
  city: string;
}

const WeatherData: React.FC<WeatherDataProps> = ({ city }) => {
  const apiKey = "e8c24597158bcaa170b724112df7498f";
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString());

  const fetchWeatherData = async () => {
    try {
      const weatherResponse = await axios.get<Weather>(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`);
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${apiKey}`);
      setForecast(forecastResponse.data.list);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  
  const handleSearch = () => {
  if (searchQuery.trim() !== '') { 
    fetchWeatherData();
  } else {
   
    console.error('Please enter a valid city name');
  }
};


  useEffect(() => {
    fetchWeatherData();
  }, []);

  const formatForecastData = () => {
    const formattedForecast: { [key: string]: ForecastItem[] } = {};
    forecast.forEach(forecastItem => {
      const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
      if (!formattedForecast[date]) {
        formattedForecast[date] = [];
      }
      formattedForecast[date].push(forecastItem);
    });
    return formattedForecast;
  };

  const getWeatherIconUrl = (weatherCode: string) => {
    return `http://openweathermap.org/img/wn/${weatherCode}.png`;
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <Container style={{ width: '80%' }} >
      <div className="weather-containerm ">
        <Card style={{ backgroundColor: '#afb0ff' }}>
          <Card.Body>
            <Form.Group controlId="formCity" className='d-flex flex-column flex-md-row'>
              
               <Form.Control
                 type="text"
                   placeholder="Enter city name"
                  value={searchQuery}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} // Update the searchQuery state
                  className='mb-2 mb-md-0'/>
              <Button
                variant="primary"
                onClick={handleSearch}
                className='m-md-2'
                style={{ backgroundColor: '#2a2b7b' }}
              >
                Search
              </Button>
            </Form.Group>
            {weather && (
              <Card className="mt-3 bg-weather text-white ">
                <h2 className='text-center'>Weather Data</h2>
                <Card.Body className=' d-flex flex-column flex-md-row' >
                  <p className='m-3'>City: {weather.name}</p>
                  <p className='m-3'>Temperature: {((weather.main.temp) - 273.15).toFixed(2)}°C</p>
                  <p className='m-3'>Speed: {weather.wind.speed}</p>
                  <p className='m-3'>Weather: {weather.weather && weather.weather[0].description}</p>
                  {weather.weather && weather.weather[0].icon && (
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather Icon" />
                  )}
                </Card.Body>
              </Card>
            )}
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Body className='text-white' style={{ backgroundColor: '#1d1f21', }}>
            <h2>Forecast</h2>
            <div className="d-flex flex-wrap justify-content-start m-3">
              {Object.keys(formatForecastData()).map(date => (
                <Button className='ml-3 text-white'
                  key={date}
                  variant="outline-primary"
                  onClick={() => handleDateClick(date)}
                  style={{ marginRight: '5px', marginBottom: '5px', border: 'none' }}
                >
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                </Button>
              ))}
            </div>
            <Card>
              <Card.Body className='text-white' style={{ backgroundColor: '#135D66', }} >
                <h4>{selectedDate}</h4>
                <Row>
                  {formatForecastData()[selectedDate]?.map((forecastItem, index) => (
                    <Col key={index}>
                      <div className="m-3">
                        <p>{new Date(forecastItem.dt * 1000).toLocaleTimeString()}</p>
                        <p>{forecastItem.weather[0].description}</p>
                        <p>{((forecastItem.main.temp) - 273.15).toFixed(2)}°C</p>
                        {forecastItem.weather && forecastItem.weather[0].icon && (
                          <img src={getWeatherIconUrl(forecastItem.weather[0].icon)} alt="Weather Icon" />
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default WeatherData;
