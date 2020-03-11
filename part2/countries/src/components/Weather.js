import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ country }) => {
    const [weather, setWeather] = useState({});

    useEffect(() => {

        let str = "http://api.weatherstack.com/current?access_key=1c1a8b4c9798061ad38bef301a367715&query=";
        str += `${country.capital}`;
        axios
            .get(str)
            .then(res => {
                setWeather(res.data);
                console.log("res", res);
            });
    }, []);

    const renderContent = () => {
        console.log("render content",weather);
        if (!weather.hasOwnProperty('current')) {
            return <div>Loading!</div>;
        }
        console.log(weather.current.weather_icons);
        return (
            <div>
                <h2>Weather in {country.capital}</h2>
                <div><strong>temperature:</strong> {weather.current.temperature} Celcius</div>
                <img src={weather.current.weather_icons[0]} />
                <div><strong>wind :</strong> {weather.current.wind_speed} kph direction {weather.current.wind_dir} </div>
            </div>
        );
    }
    return (
        <div>{renderContent()}</div>
    );

};

export default Weather;
