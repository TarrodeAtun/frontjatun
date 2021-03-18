var axios = require('axios');
var Axios = axios.create({
  baseURL: 'http://localhost:4000',
});

module.exports = Axios;