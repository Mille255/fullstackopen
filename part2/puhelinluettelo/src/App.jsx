import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

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
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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