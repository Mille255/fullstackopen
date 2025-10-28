import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

   
  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map((person, index) => (
          <p key={index}>{person.name} {person.number}</p>
        ))}
            
    </div>
  )

}

export default App