import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
 <div>
          filter shown with <input 
                 value={newFilter}
                 onChange={handleFilterChange}
                  />
        </div>
  )
}

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form  onSubmit={addName}>
        <div>
          name: <input 
                  value={newName}
                  onChange={handleNameChange}
                  />
        </div>
        <div>
        number: <input 
                  value={newNumber}
                  onChange={handleNumberChange}
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({persons, handleDelete}) => {
  return (
    <div>
    {persons.map((person) => (
      <Person 
      key={person.id} 
      person={person}
      handleDelete={() => handleDelete(person.id)}
      />
    ))}
    </div>
  ) 
}

const Person = ({person, handleDelete }) => {
  return (
    <div>
       <p>{person.name} {person.number} {' '} 
       <button onClick={handleDelete}>delete</button></p>
    </div>
    
  ) 
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message}</div>;
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Phonebook by Mille, Department of Computer Science, University of Helsinki 2025</em>
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    const nameExists = persons.some(person => person.name === newName);
    if (nameExists) {
      setMessageType('error');
      setErrorMessage(`Name ${newName} is already added to Numbers list`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }else {
    personService
    .create(nameObject)
    .then(returnedPerson => { 
    setPersons(persons.concat(returnedPerson))
    setNewName('')
    setNewNumber('')
    setMessageType('success');
    setErrorMessage(`Added ${newName} `)
    setTimeout(() => {
    setErrorMessage(null)
      }, 5000)

    })
    }
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setMessageType('success');
          setErrorMessage(`Deleted ${person.name}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Delete failed:', error);
          setMessageType('error');
          setErrorMessage(`Failed to delete ${person.name}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  }

   const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );
  console.log(filteredPersons);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <Notification message={errorMessage} type={messageType} />
       <PersonForm 
        addName={addName} 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete}/>
      <Footer />
    </div>
  )

}

export default App