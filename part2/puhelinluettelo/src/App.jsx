import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const nameExists = persons.some(person => person.name === newName);

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      id: newName,
    }
    if (nameExists) {
    alert(`${newName} on jo lisätty listalle`)
    }else {
    setPersons(persons.concat(nameObject))
    setNewName('')
      }
    }

   const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
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
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person, index) => (
          <p key={index}>{person.name}</p>
        ))}
            
    </div>
  )

}

export default App