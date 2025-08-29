# 🎯 ElevenLabs SDK Validation Tool

A focused, minimal tool for validating ElevenLabs Conversational AI real-time performance using the official React SDK.

## 🎯 What This Tool Does

**Core Objective**: Test if ElevenLabs can achieve acceptable real-time latency (<1.5s) for conversational AI applications.

**Validation Process**:
1. **Connect** to ElevenLabs via official SDK
2. **Start** real-time conversation session
3. **Monitor** AI responses and audio playback
4. **Measure** end-to-end latency performance
5. **Track** performance metrics in real-time

## 🏗️ Current Architecture

**Clean, SDK-First Design**:
- **1 Core Hook**: `useElevenLabsConversation` - SDK integration
- **1 Utility**: `ConversationPerformanceMonitor` - Performance tracking
- **1 Config**: `environment.js` - Configuration management
- **Total**: ~300 lines of focused validation code

### File Structure
```
src/
├── hooks/
│   └── useElevenLabsConversation.js    # Official SDK integration
├── utils/
│   └── performanceMonitor.js           # Performance metrics
├── config/
│   └── environment.js                  # Configuration
└── App.js                              # Main application
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- ElevenLabs API key and agent ID

### Installation
```bash
git clone <repository>
cd ElevenLabsExample
npm install
```

### Configuration
Update `app.config.js` with your ElevenLabs credentials:
```javascript
export default {
  expo: {
    extra: {
      ELEVENLABS_API_KEY: "your-api-key-here",
      ELEVENLABS_AGENT_ID: "your-agent-id-here",
    }
  }
};
```

### Run
```bash
npm start          # Start Expo development server
npm run auto      # Auto-restart server with monitoring
```

## 📊 Success Criteria

**Target Metrics**:
- ✅ **SDK Connection**: Establishes and maintains stable connection
- ✅ **Conversation Start**: Successfully initiates AI conversation
- ✅ **Real-time Responses**: AI responds with acceptable latency
- ✅ **Latency Target**: End-to-end <1.5 seconds
- ✅ **Audio Playback**: AI responses play back clearly

## 🔧 Technical Details

**SDK Integration**:
- **Package**: `@elevenlabs/react` v0.5.2
- **Connection Type**: WebSocket (configurable to WebRTC)
- **Event Handling**: Built-in connection lifecycle management
- **Error Handling**: Comprehensive error handling with retry logic

**Performance Monitoring**:
- **Real-time Metrics**: Live latency tracking
- **Response Timing**: First response and average response times
- **Target Validation**: <1.5s latency requirement checking
- **Session Analytics**: Conversation duration and response counts

## 🎯 Validation Results

**This tool will tell you**:
- Can ElevenLabs achieve real-time conversation?
- What's the actual latency vs. targets?
- Is the audio quality sufficient for production use?
- Should you proceed with ElevenLabs integration?

**Success = Proven technical feasibility**
**Failure = Clear data on performance limitations**

## 🚨 Troubleshooting

**Common Issues**:
- **Connection Failed**: Check API key and agent ID in app.config.js
- **Agent Not Responding**: Verify agent is properly configured in ElevenLabs
- **Performance Issues**: Check network latency and ElevenLabs service status

**Debug Mode**: Check browser console for detailed logging and performance metrics

---

**Purpose**: This is a validation tool, not a production application. It's designed to test ElevenLabs feasibility with minimal complexity using the official SDK.
