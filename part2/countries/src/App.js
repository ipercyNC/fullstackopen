import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Country from './components/Country';
import Weather from './components/Weather';

const App = (props) => {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState('');

    const handleSearchChange = (event) => {
        console.log(event.target.value);
        setSearch(event.target.value);
    }
    const languages = (country) => {
        console.log(country.languages);
        return country.languages.map(language => {
            return (<li key={language.name}>{language.name}</li>)

        });
    }
    const countriesToShow =
        countries.filter(country => { if (country.name.toLowerCase().startsWith(search.toLowerCase())) return true;});
    const rows = () => {
        console.log(countriesToShow);
        if (countriesToShow.length > 10)
            return (<div>Too many matches, specify another filter</div>);
        if (countriesToShow.length === 1) {
            const country = countriesToShow[0];
            return (
                <div>
                    <h1>{country.name}</h1>
                    <div>capital {country.capital}</div>
                    <div>population {country.population}</div>
                    <h2>languages</h2>
                    <ul>
                        {languages(country)}
                    </ul>
                    <img src={country.flag} alt='flag' height="150px" />
                    <Weather country={country} />
                </div>
            );
        }
        else
            return countriesToShow.map(country => {
                return <Country country={country} />;
            });
    }
    useEffect(() => {
        console.log('effect');
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(res => {
                console.log('promise fulfilled');
                setCountries(res.data);
            });
    }, []);

    return (
        <div>
            <input
                value={search}
                onChange={handleSearchChange}
            />
            {rows()}
        </div>
    );
};

export default App;