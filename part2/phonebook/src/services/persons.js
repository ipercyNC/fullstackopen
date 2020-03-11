import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    const req = axios.get(baseUrl);
    return req.then(res => res.data);
}

const create = newObject => {
    const req = axios.post(baseUrl, newObject);
    return req.then(res => res.data);
}

const update = (id, newObject) => {
    const req = axios.put(`${baseUrl}/${id}`, newObject);
    return req.then(res => res.data);
}

const deletePerson = (id) => {
    console.log(`${baseUrl}/${id}`);
    const req = axios.delete(`${baseUrl}/${id}`);
    console.log(req);
    return req.then(res => res.data);
}

export default { getAll, create, update, deletePerson };