var axios = require('axios');
var Axios = axios.create({
  baseURL: 'http://ec2-3-16-187-93.us-east-2.compute.amazonaws.com:3000',
});

module.exports = Axios;