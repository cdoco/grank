import axios from 'axios';

//github
const github = axios.create({
    baseURL: 'https://api.github.com',
});

//codehub
const codehub = axios.create({
    baseURL: 'http://trending.codehub-app.com/v2',
});

module.exports = { github, codehub };