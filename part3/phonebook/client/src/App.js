import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import Person from './components/Person';
import ErrorNotification from './components/ErrorNotification';
import SuccessNotification from './components/SuccessNotification';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newSearch, setNewSearch] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const rows = () => {
        if (newSearch !== '') {
            return persons.filter(person => { return person.name.toLowerCase().startsWith(newSearch.toLowerCase()) })
                .map(person => {
                    return <Person
                        key={person.id}
                        name={person.name}
                        number={person.number}
                        deletePerson={() => deletePerson(person.name, person.id)}
                    />;
                });
        }
        else
            return persons.map(person => {
                return <Person
                            key={person.id}
                            name={person.name}
                            number={person.number}
                            deletePerson={() => deletePerson(person.name, person.id)}
                        />;
            });
    };
    const deletePerson = (name, id) => {
        const ans = window.confirm(`Delete ${name}?`);
        if (ans === true) {
            personsService
                .deletePerson(id)
                .then(res => {
                    const newPersons = persons.filter(person => { return person.id !== id });
                    setPersons(newPersons);
                })
                .catch(error => {
                    setErrorMessage(`Information from ${name} has already been removed from server`);
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 3000);
                });
        }
    }
    const onNameChange = (event) => {
        setNewName(event.target.value);
    }

    const onSearchChange = (event) => {
        setNewSearch(event.target.value);
    }

    const onNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    useEffect(() => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons);
            })
    }, []);

    const addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber
        };
        //console.log("persons[newname] ", persons[newName]);
        const p = persons.find(p => p.name === newName);
        if (p === undefined) {
            personsService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                    setSuccessMessage(
                        `Added ${returnedPerson.name}`);
                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 3000);
                    setNewName('');
                    setNewNumber('');
                })
                .catch(error => {
                    setErrorMessage(error.response.data.error);
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 3000);
                });
        }
        else {
            const ans = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
            if (ans === true) {
                const changedPerson = { ...p, number: newNumber };
                personsService
                    .update(p.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person =>
                            person.id !== p.id ? person : changedPerson));
                        setSuccessMessage(
                            `Updated ${returnedPerson.name}`);
                        setTimeout(() => {
                            setSuccessMessage(null);
                        }, 3000);
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(error => {
                        setErrorMessage(`Information of ${newName} has already been removed from server`);
                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 3000);
                        setPersons(persons.filter(curr => curr.id !== p.id));
                    })
            }
        }
        
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <ErrorNotification message={errorMessage} />
            <SuccessNotification message={successMessage} />

            filter shown with <input value={newSearch}
                onChange={onSearchChange} />
            <h2>add a new</h2>
            <form onSubmit={addPerson}>
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