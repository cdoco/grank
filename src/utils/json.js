import axios from 'axios';

const json = axios.create({
    baseURL: 'https://api.github.com',
});

module.exports = {
    json,
};