# Setup Instructions for ElevenLabs Performance Testing Tool

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn**
3. **ElevenLabs Account** with API key and agent ID

## Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Configuration

### Step 1: Create Environment File
Create a `.env` file in the project root with the following content:

```bash
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_actual_api_key_here
ELEVENLABS_AGENT_ID=your_actual_agent_id_here

# Environment (optional)
NODE_ENV=development
```

### Step 2: Get Your ElevenLabs Credentials

1. **API Key**:
   - Go to [ElevenLabs Dashboard](https://elevenlabs.io/)
   - Navigate to Profile → API Key
   - Copy your API key

2. **Agent ID**:
   - Go to [ElevenLabs Agents](https://elevenlabs.io/agents)
   - Create a new agent or select an existing one
   - Copy the Agent ID from the URL or agent details

### Step 3: Update .env File
Replace the placeholder values in your `.env` file with your actual credentials.

## Running the Application

### Development Mode
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator

### Web Only
```bash
npm run web
```

### Mobile Development
```bash
# iOS
npm run ios

# Android
npm run android
```

## Troubleshooting

### Common Issues

1. **"Cannot access 'conversation' before initialization"**
   - This has been fixed in the latest version
   - Ensure you're using the updated code

2. **"Environment configuration is incomplete"**
   - Check that your `.env` file exists and has the correct variables
   - Ensure the file is in the project root directory
   - Restart the development server after creating/modifying `.env`

3. **"ELEVENLABS_AGENT_ID is not configured"**
   - Verify your `.env` file has the correct variable names
   - Check for typos in the variable names
   - Ensure no extra spaces or quotes around values

4. **Performance Monitor Not Working**
   - Check browser console for any JavaScript errors
   - Ensure all dependencies are properly installed
   - Try clearing browser cache and restarting

### Environment Variable Format

**Correct format:**
```bash
ELEVENLABS_API_KEY=sk-1234567890abcdef
ELEVENLABS_AGENT_ID=agent_1234567890abcdef
```

**Incorrect formats:**
```bash
# Don't use quotes
ELEVENLABS_API_KEY="sk-1234567890abcdef"

# Don't add spaces around equals sign
ELEVENLABS_API_KEY = sk-1234567890abcdef

# Don't use semicolons
ELEVENLABS_API_KEY=sk-1234567890abcdef;
```

### Verification Steps

1. **Check Environment Loading**:
   - Open browser console
   - Look for "Environment Configuration" log message
   - Verify both API key and Agent ID show "***SET***"

2. **Test Connection**:
   - Click "Start Conversation"
   - Check for any error messages
   - Verify connection status changes to "connected"

3. **Performance Monitoring**:
   - Start a conversation
   - Ask a few questions
   - Check that performance metrics are displayed
   - Verify audio quality rating prompts appear

## Development Notes

- The app uses **Expo** for cross-platform development
- **React 19** with modern hooks and performance optimizations
- **ElevenLabs React SDK** for conversation management
- **Custom performance monitoring** for comprehensive metrics

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed
4. Check that you're using the latest version of the code

## Next Steps

Once the app is running successfully:

1. **Read the Performance Testing Guide** (`PERFORMANCE_TESTING_GUIDE.md`)
2. **Start with basic testing** (5-minute sessions)
3. **Export performance data** after each session
4. **Analyze results** using the provided data structure
5. **Present findings** to stakeholders using the client reporting templates
