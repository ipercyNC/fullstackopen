import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newSearch, setNewSearch] = useState('');
    const [newNumber, setNewNumber] = useState('');

    const rows = () => {
        if (newSearch !== '') {
            return persons.filter(person => { return person.name.toLowerCase().startsWith(newSearch.toLowerCase()) })
                .map(person => {
                    return <div key={person.name}>{person.name} {person.number}</div>
                });

        }
        else
            return persons.map(person => {
                return <div key={person.name}>{person.name} {person.number}</div>;
            });
    };
    const onNameChange = (event) => {
        console.log(event.target.value);
        setNewName(event.target.value);
    }
    const onSearchChange = (event) => {
        setNewSearch(event.target.value);
    }
    const onNumberChange = (event) => {
        setNewNumber(event.target.value);
    }
    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(res => {
                setPersons(res.data);
            })
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>
            filter shown with <input value={newSearch}
                onChange={onSearchChange} />
            <h2>add a new</h2>
            <form>
                <div>
                    name: <input value={newName}
                        onChange={onNameChange} />
                </div>
                <div>
                    number: <input value={newNumber}
                        onChange={onNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {rows()}
    </div>
    )
}

export default App;