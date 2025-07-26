const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SmartKart...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync('env.example', '.env');
  console.log('✅ .env file created. Please update the configuration values.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Install server dependencies
console.log('📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed.\n');
} catch (error) {
  console.error('❌ Failed to install server dependencies:', error.message);
  process.exit(1);
}

// Install client dependencies
console.log('📦 Installing client dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Client dependencies installed.\n');
} catch (error) {
  console.error('❌ Failed to install client dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your configuration');
console.log('2. Start MongoDB (if not already running)');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, see the README.md file'); 