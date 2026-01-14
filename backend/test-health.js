const https = require('https');

const url = 'https://mern-stack-project-backend-5osd.onrender.com/health';

https.get(url, (res) => {
  console.log('StatusCode:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Health Check Response:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
