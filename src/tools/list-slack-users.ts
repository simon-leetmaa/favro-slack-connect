/**
 * Simple script to list all Slack users and their IDs
 * Run with: npx ts-node src/tools/list-slack-users.ts
 */
import { slackUserService } from '../services/slackUsers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function listSlackUsers() {
  try {
    console.log('Fetching users from Slack workspace...\n');
    const users = await slackUserService.getAllUsers();
    
    if (users.length === 0) {
      console.log('No users found or there was an issue with the Slack API token.');
      return;
    }
    
    console.log(`Found ${users.length} users in your Slack workspace:\n`);
    console.log('ID                | Username      | Full Name                    | Email');
    console.log('------------------|---------------|------------------------------|------------------------');
    
    users.forEach(user => {
      const id = user.id || 'N/A';
      const name = user.name || 'N/A';
      const realName = user.real_name || 'N/A';
      const email = user.email || 'N/A';
      
      console.log(`${id.padEnd(18)} | ${name.padEnd(13)} | ${realName.padEnd(28)} | ${email}`);
    });
    
    // Create a sample user mapping file
    const sampleMappings = users.reduce((acc, user) => {
      if (user.name) {
        acc[user.name] = user.id || '';
      }
      return acc;
    }, {} as Record<string, string>);
    
    const samplePath = path.join(__dirname, '../../sample-user-mapping.json');
    fs.writeFileSync(samplePath, JSON.stringify(sampleMappings, null, 2));
    
    console.log(`\nSample user mapping saved to: ${samplePath}`);
    console.log(`\nTo use these mappings, copy the relevant entries to src/config/userMapping.ts`);
    
  } catch (error) {
    console.error('Error fetching Slack users:', error);
    console.log('\nPlease check that:');
    console.log('1. You have set SLACK_BOT_TOKEN in your .env file');
    console.log('2. Your token has the "users:read" and "users:read.email" scopes');
    console.log('3. Your bot has been added to the workspace');
  }
}

// Run the function
listSlackUsers();
