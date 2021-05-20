var axios = require('axios');
var Axios = axios.create({
  baseURL: 'http://ec2-18-116-235-30.us-east-2.compute.amazonaws.com:3000',
});

module.exports = Axios;