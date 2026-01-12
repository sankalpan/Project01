const https = require('https');

const url = 'https://mern-stack-project-backend-5osd.onrender.com/api/news/entertainment';

https.get(url, (res) => {
  console.log('StatusCode:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('\nBody:\n', data);
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
