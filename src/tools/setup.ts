/**
 * Setup script for Favro-Slack Integration
 * Run with: npx ts-node src/tools/setup.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Log a message with optional color
 */
function log(message: string, color = colors.reset): void {
  console.log(color + message + colors.reset);
}

/**
 * Execute a command and return the output
 */
function execCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8' });
  } catch (error) {
    return '';
  }
}

/**
 * Check if Node.js is installed and meets the minimum version requirement
 */
function checkNodeVersion(): boolean {
  try {
    const nodeVersionOutput = execCommand('node -v');
    const versionMatch = nodeVersionOutput.match(/v(\d+)\.\d+\.\d+/);
    
    if (!versionMatch) {
      log('❌ Could not determine Node.js version.', colors.red);
      return false;
    }
    
    const majorVersion = parseInt(versionMatch[1], 10);
    if (majorVersion < 14) {
      log(`❌ Node.js v${nodeVersionOutput.trim()} is not supported.`, colors.red);
      log('   Please upgrade to Node.js v14 or higher.', colors.yellow);
      return false;
    }
    
    log(`✅ Node.js ${nodeVersionOutput.trim()} detected`, colors.green);
    return true;
  } catch (error) {
    log('❌ Node.js is not installed or could not be detected.', colors.red);
    log('   Please install Node.js v14 or higher.', colors.yellow);
    log('   Visit https://nodejs.org/en/download/ for installation instructions.', colors.cyan);
    return false;
  }
}

/**
 * Check if .env file exists, if not create it from example
 */
function setupEnvFile(): void {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log('\n⚙️ Creating .env configuration file...', colors.cyan);
    fs.copyFileSync(envExamplePath, envPath);
    log('   Please edit the .env file with your Slack Bot Token and other settings.', colors.yellow);
  } else if (fs.existsSync(envPath)) {
    log('\n✅ .env file already exists', colors.green);
  } else {
    log('\n❌ Could not find .env.example to create .env file', colors.red);
  }
}

/**
 * Install npm dependencies
 */
function installDependencies(): boolean {
  log('\n📦 Installing dependencies...', colors.cyan);
  try {
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependencies installed successfully', colors.green);
    return true;
  } catch (error) {
    log('❌ Failed to install dependencies', colors.red);
    console.error(error);
    return false;
  }
}

/**
 * Build the TypeScript project
 */
function buildProject(): boolean {
  log('\n🔨 Building the application...', colors.cyan);
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build completed successfully', colors.green);
    return true;
  } catch (error) {
    log('❌ Build failed', colors.red);
    console.error(error);
    return false;
  }
}

/**
 * Main setup function
 */
async function setup(): Promise<void> {
  log('\n🚀 Favro-Slack Integration Setup', colors.bright + colors.cyan);
  log('================================\n', colors.cyan);
  
  // Check Node.js version
  const nodeOk = checkNodeVersion();
  if (!nodeOk) {
    process.exit(1);
  }
  
  // Install dependencies
  const depsOk = installDependencies();
  if (!depsOk) {
    process.exit(1);
  }
  
  // Setup .env file
  setupEnvFile();
  
  // Build the project
  const buildOk = buildProject();
  if (!buildOk) {
    process.exit(1);
  }
  
  log('\n🎉 Setup complete!', colors.bright + colors.green);
  log('\n📝 Next steps:', colors.bright);
  log('1. Edit your .env file with your Slack Bot Token and Favro Webhook Secret', colors.yellow);
  log('2. Run the user mapping setup: npm run setup-mapping', colors.yellow);
  log('3. Start the server: npm start', colors.yellow);
  log('\nFor more information, see the README.md file.', colors.cyan);
}

// Run the setup function
setup().catch(error => {
  console.error('Error during setup:', error);
  process.exit(1);
});
