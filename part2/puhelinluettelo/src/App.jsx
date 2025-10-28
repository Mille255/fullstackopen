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

const Persons = ({persons}) => {
  return (
    <div>
    {persons.map((person, index) => (
      <Person key={index} name={person.name} number={person.number}/>
    ))}
    </div>
  ) 
}

const Person = ({name, number }) => {
  return (
    <div>
       <p>{name} {number}</p>
    </div>
    
  ) 
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
  console.log('effect')
  personService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
}, [])
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      id: newName,
      number: newNumber,
    }
    const nameExists = persons.some(person => person.name === newName);
    if (nameExists) {
    alert(`${newName} on jo lisätty listalle`)
    }else {
    personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
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
       <PersonForm 
        addName={addName} 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )

}

export default App