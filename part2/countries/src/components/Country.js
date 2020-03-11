import React, { useState }  from 'react';

const languages = (country) => {
    console.log(country.languages);
    return country.languages.map(language => {
        return (<li key={language.name}>{language.name}</li>)

    });
}
const Country = ({ country }) => {
    const [show, setShow] = useState(false);
    const renderContent = () => {
        if (show) {
            return (

                <div>
                    <h1>{country.name}</h1>
                    <button onClick={() => setShow(!show)}>
                        hide
                    </button>
                    <div>capital {country.capital}</div>
                    <div>population {country.population}</div>
                    <h2>languages</h2>
                    <ul>
                        {languages(country)}
                    </ul>
                    <img src={country.flag} alt='flag' height="150px" />    
                </div>
            );
        }
        else {
            return (
                <div>{country.name} 
                <button onClick={() => setShow(!show)}>
                    show
                </button>
                </div>
            );
        }
    }
    return (
        <div>
            {renderContent()}
        </div>
    );

};

export default Country;
