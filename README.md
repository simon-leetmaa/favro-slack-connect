# Favro-Slack Integration

A professional integration service that automatically sends direct messages to Slack users when they are mentioned in Favro comments. Perfect for teams using both Favro and Slack who want to improve communication and responsiveness.

## 🌟 Key Features

- **Automatic Notifications**: Instantly notifies Slack users when mentioned in Favro comments
- **User Mapping**: Flexible mapping between Favro usernames and Slack user IDs
- **Secure**: Uses webhook signature verification for secure data transfer
- **Reliable**: Built with TypeScript for type safety and reliability
- **Low Maintenance**: Simple to set up and requires minimal ongoing management

## 📋 Requirements

- **Node.js**: v14 or higher
- **Slack Workspace**: With permission to add a bot
- **Favro Organization**: With permission to create webhooks
- **Server/Hosting**: Any platform that can run Node.js applications

## 🔒 Security Considerations

This integration requires:

- A Slack Bot Token with permission to send direct messages
- A Favro Webhook Secret for authenticating incoming requests

All secrets are stored as environment variables and never hardcoded. No data is permanently stored - the application only processes webhooks and sends messages to Slack.

## 🚀 Quick Setup Guide

### 1. Create a Slack App

1. Go to [Slack API Apps page](https://api.slack.com/apps)
2. Click "Create New App" and select "From scratch"
3. Configure your app with these settings:

#### Basic Information

- **App Name**: Favro Comment Buddy
- **Description**: Notifies you on Slack when you're mentioned in a Favro comment.
- **Background Color**: #634b70
- **Long Description**: A helpful bot that sends you direct Slack notifications whenever you're mentioned in a Favro comment. Stay instantly updated, never miss important feedback, and streamline your team collaboration—all without leaving Slack.

#### Bot User

Under the "App Home" tab:
- **Display Name**: Favro Comment Buddy
- **Always Online**: Off (optional)

#### OAuth & Permissions

Add these Bot Token Scopes:
- `users:read` (to read user information)
- `users:read.email` (to match users by email)
- `chat:write` (to send messages)
- `im:write` (to open DM channels)

4. Install the app to your workspace
5. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 2. Set Up This Integration

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/favro-slack-integration.git
   cd favro-slack-integration
   ```

2. Run our automated setup script which will install dependencies, create your environment file, and build the application:
   ```bash
   npm run setup
   ```

3. Edit your `.env` file with your Slack Bot Token and Favro Webhook Secret:
   ```
   SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
   FAVRO_WEBHOOK_SECRET=your-favro-webhook-secret
   ```

### 3. Configure User Mapping (Interactive)

We've created an interactive tool to map your Slack users to Favro usernames:

```bash
npm run setup-mapping
```

This tool will:
1. Connect to your Slack workspace and list all users
2. For each Slack user, ask you to enter their Favro username
3. Press Enter to skip a user, or type "done" to finish
4. Generate the mapping file automatically

### 4. Create a Favro Webhook

1. In Favro, go to Organization Settings > API & Webhooks
2. Create a new webhook with these settings:
   - URL: `https://your-server.com/webhook` (your deployed server address)
   - Events: Select "Comment Created" and "Comment Updated"
   - Save the webhook secret for your `.env` file

## 📝 Usage Notes

- After setup, start the server with: `npm start`
- The integration will listen for Favro webhook events at the `/webhook` endpoint
- You can check if the server is running properly at `/health`

## 🔍 Troubleshooting

Common issues and solutions:

- **No notifications being sent**: 
  - Check that your user mapping has the correct Favro usernames
  - Verify your Slack token has the right permissions
  - Make sure your Favro webhook is properly configured

- **Webhook signature verification failing**: 
  - Verify your FAVRO_WEBHOOK_SECRET in your `.env` file matches exactly what's in Favro

- **Connection issues**: 
  - Ensure your server is accessible from the internet (if using locally, try [ngrok](https://ngrok.com/))
  - Confirm your Favro webhook URL points to your server's `/webhook` endpoint

## 📚 Configuration Options

All configuration is done through environment variables in your `.env` file:

- `SLACK_BOT_TOKEN`: Your Slack Bot Token (required)
- `FAVRO_WEBHOOK_SECRET`: Your Favro webhook secret (required)
- `PORT`: The port to run the server on (default: 3000)
- `WEBHOOK_URL`: Custom webhook URL (default: http://localhost:PORT/webhook)
- `LOG_LEVEL`: Logging verbosity (default: info)

## 🤝 Getting Help

If you encounter issues or have questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub

## Quick Command Reference

- `npm run setup`: Install dependencies and configure the application
- `npm run setup-mapping`: Set up user mapping between Slack and Favro
- `npm run dev`: Start development server with hot-reload
- `npm start`: Start the production server
- `npm run build`: Manually build the TypeScript project

## Deployment Options

1. **Local Development**: 
   - Use a tool like [ngrok](https://ngrok.com/) to expose your local server
   - Run `npm start` and configure Favro to point to your ngrok URL

2. **Cloud Deployment**:
   - Deploy to any Node.js hosting platform (Heroku, AWS, DigitalOcean, etc.)
   - Set the required environment variables on your hosting platform
   - Configure Favro to point to your hosted URL
