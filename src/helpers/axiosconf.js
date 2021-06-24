var axios = require('axios');
var Axios = axios.create({
  baseURL: 'http://ec2-13-59-149-127.us-east-2.compute.amazonaws.com:3000',
});

module.exports = Axios;