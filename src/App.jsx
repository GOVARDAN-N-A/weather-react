
import { useEffect, useState } from 'react'
import PropTypes from "prop-types";

import './App.css'

// images
import searchIcon from './assets/search.png'
import clearIcon from './assets/clear.png'
import cloudyIcon from './assets/cloudy.png'
import rainyIcon from './assets/rainy.png'
import drizzleIcon from './assets/drizzle.png'
import humidityIcon from './assets/humidity(1).png'
import snowIcon from './assets/snow.png'
import hazeIcon from './assets/haze.png'
import windyIcon from './assets/windy.png'

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Cloudy" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="latitude">
          <span className='lat'>Latitude:</span>
          <span>{lat}</span>
        </div>
        <div className="log">
          <span className='lat'>Longitude:</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" width={30} height={30} className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}</div>
            <div className="element-text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windyIcon} alt="Wind" width={30} height={30} className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="element-text">Wind Speed</div>
          </div>
        </div>

      </div>
    </>)
};


function App() {
  let apiKey = "d74b05a17182c238366185f9606981de"
  const [text, setText] = useState("Tiruchirappalli");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setcountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "81d": clearIcon,
    "81n": clearIcon,
    "82d": cloudyIcon,
    "82n": cloudyIcon,
    "83d": drizzleIcon,
    "83n": drizzleIcon,
    "84d": drizzleIcon,
    "84n": drizzleIcon,
    "89d": rainyIcon,
    "89n": rainyIcon,
    "10d": rainyIcon,
    "18n": rainyIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "03d": cloudyIcon,
    "02d": cloudyIcon,
    "03n": cloudyIcon,
    "50d": hazeIcon,
  };
  

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    try{
      let res = await fetch(url);
      let data = await res.json();
      if(data.cod === "404"){
        console.log("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }else{
        setCityNotFound(false);
        // setIcon(data.weather[0].icon);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setcountry(data.sys.country);
        setLat(data.coord.lat);
        setLog(data.coord.lon);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon);
        setCityNotFound(false);
      }
    }catch{
      console.error("Error Found", error.message);
      setError("Something went wrong. Please try again later.");
    }
    finally{
      setLoading(false);
    }
  };

  const handleCity = (event) => {
    setText(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  }

  useEffect(() => {
    search();
  }, [])

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search city' onChange={handleCity} onKeyDown={handleKeyDown} value={text} />
          <div className='searchIcon'>
            <img src={searchIcon} alt="Search" width={25} height={20} onClick={() => search()} />
          </div>
        </div>
   

        {loading && <div className="loading-msg">
          {/* Loading... */}
          <img src="https://i.gifer.com/3WyW.gif" alt="Loading.." width={150} height={150} />
        </div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found img</div>}

        {!loading && !error && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}

        <p className="copyright">
          Designed by <span>Govardan</span>
        </p>
      </div>
    </>
  )
}

export default App
