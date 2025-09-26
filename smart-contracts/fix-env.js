const fs = require('fs');

// Read the .env file
let envContent = fs.readFileSync('.env', 'utf8');

// Add 0x prefix to the private key if it doesn't have it
envContent = envContent.replace(
  'PRIVATE_KEY=7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186',
  'PRIVATE_KEY=0x7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186'
);

// Write back to .env file
fs.writeFileSync('.env', envContent);

console.log('✅ Fixed private key format in .env file');
