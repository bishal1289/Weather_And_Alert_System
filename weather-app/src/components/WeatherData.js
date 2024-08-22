import React, { useState, useEffect } from 'react';
import './WeatherData.css'; // Import custom CSS for styling

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [unit, setUnit] = useState('C'); // State to toggle temperature unit

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/weather/');
        const data = await response.json();
        setWeatherData(data);
        setSelectedCity(data[0]); // Set the first city as default
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  // Function to determine background image based on weather condition
  const getBackgroundImage = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'Clear.jpg';
      case 'clouds':
        return 'clouds.jpg';
      case 'rain':
        return 'Rain.jpg';
      case 'haze':
        return 'Haze.jpg';
      case 'mist':
        return 'mist.jpg';
      default:
        return 'defult.jpg';
    }
  };

  // Convert Celsius to Kelvin
  const convertToKelvin = (celsius) => {
    return (celsius + 273.15).toFixed(2);
  };

  return (
    <div className="weather-data-container mt-5">
      <div className="d-flex">
        {/* Sidebar for city selection */}
        <div className="sidebar">
          <div
            className="nav flex-column nav-pills"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <h4 className="text-center mb-3">Cities</h4>
            {weatherData.map((cityWeather, index) => (
              <button
                key={index}
                className={`nav-link ${
                  selectedCity && selectedCity.city === cityWeather.city
                    ? 'active'
                    : ''
                }`}
                id={`v-pills-${cityWeather.city}-tab`}
                data-bs-toggle="pill"
                data-bs-target={`#v-pills-${cityWeather.city}`}
                type="button"
                role="tab"
                aria-controls={`v-pills-${cityWeather.city}`}
                aria-selected={
                  selectedCity && selectedCity.city === cityWeather.city
                }
                onClick={() => handleCityClick(cityWeather)}
              >
                {cityWeather.city}
              </button>
            ))}
          </div>
        </div>

        {/* Main content for selected city's weather details */}
        <div className="main-content flex-grow-1">
          <div
            className="weather-details"
            style={{
              minHeight: '400px',
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${getBackgroundImage(selectedCity ? selectedCity.main : 'default')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            {selectedCity ? (
              <div className="text-center text-shadow">
                <h2 className="mb-4">{selectedCity.city}</h2>
                <h4 className="mb-4">{selectedCity.main}</h4>
                <div className="weather-info">
                  <p>
                    <strong>Temperature:</strong> {unit === 'C' ? selectedCity.temperature : convertToKelvin(selectedCity.temperature)}°{unit}
                  </p>
                  <p>
                    <strong>Feels Like:</strong> {unit === 'C' ? selectedCity.feels_like : convertToKelvin(selectedCity.feels_like)}°{unit}
                  </p>
                  <p>
                    <strong>Humidity:</strong> {selectedCity.humidity}%
                  </p>
                  <p>
                    <strong>Pressure:</strong> {selectedCity.pressure} hPa
                  </p>
                  <p>
                    <strong>Wind Speed:</strong> {selectedCity.windSpeed} km/h
                  </p>
                </div>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => setUnit(unit === 'C' ? 'K' : 'C')}
                >
                  Toggle to {unit === 'C' ? 'Kelvin' : 'Celsius'}
                </button>
              </div>
            ) : (
              <p className="text-center pt-5">Select a city to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
