const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    // Test basic server response
    const response = await axios.get('http://localhost:5000/protected', {
      headers: {
        'Authorization': 'Bearer test'
      }
    });
    console.log('Server is running!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running. Please start the server first:');
      console.error('   cd server && node server.js');
    } else {
      console.error('❌ Server error:', error.message);
    }
  }
}

testServer(); 