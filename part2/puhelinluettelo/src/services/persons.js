

import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
        console.error('Failed to retrieve persons:', error);
        throw error;
    });
  }
  
const create = newObject => {
    return axios.post(baseUrl, newObject)
    .then(response => response.data)
    .catch(error => {
        console.error('Failed to create a new person:', error);
        throw error;
    });
  }

  const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
        .then(response => {
            console.log(`Person ${id} was deleted`);
            return response;
        })
        .catch(error => {
            console.error(`Failed to delete person ${id}:`, error);
            throw error;
        });
}

  export default {getAll, create, deletePerson}