// This file helps Railway detect this as a Node.js project
console.log('PoolFi - Collaborative Savings Platform');
console.log('Starting application...');

// Redirect to frontend
const { exec } = require('child_process');
const path = require('path');

const frontendPath = path.join(__dirname, 'frontend');

console.log('Changing to frontend directory:', frontendPath);
process.chdir(frontendPath);

// Start the Next.js application
exec('npm start', (error, stdout, stderr) => {
  if (error) {
    console.error('Error starting application:', error);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
});
