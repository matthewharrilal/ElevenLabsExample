# 🎯 ElevenLabs Validation Tool

A focused, minimal tool for validating ElevenLabs Conversational AI real-time performance and readiness for HeyGen video integration.

## 🎯 What This Tool Does

**Core Objective**: Test if ElevenLabs can achieve acceptable real-time latency (<1.5s) for HeyGen avatar integration.

**Validation Process**:
1. **Connect** to ElevenLabs via WebSocket
2. **Record** real-time audio (16kHz, mono, 16-bit PCM)
3. **Send** audio chunks to ElevenLabs for processing
4. **Receive** AI responses and audio playback
5. **Measure** end-to-end latency performance

## 🏗️ Current Architecture

**Minimal, Focused Design**:
- **3 Core Hooks**: WebSocket client, audio pipeline, basic state
- **1 UI Component**: Simple recording controls
- **1 Config File**: Essential ElevenLabs settings
- **Total**: ~536 lines of focused validation code

### File Structure
```
src/
├── hooks/
│   ├── useElevenLabsClient.js    # WebSocket + API communication
│   └── useAudioPipeline.js       # Audio recording + playback
├── components/
│   └── RecordingControls.js      # Basic record/stop UI
└── config/
    └── validation.js             # Essential settings
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
Edit `src/config/validation.js` with your ElevenLabs credentials:
```javascript
export const ELEVENLABS_CONFIG = {
  apiKey: "your_actual_api_key",
  agentId: "your_actual_agent_id",
  websocketUrl: "wss://api.elevenlabs.io/v1/convai/conversation"
};
```

### Run
```bash
npm start          # Start Expo development server
npm run auto      # Auto-restart server with monitoring
```

## 📊 Success Criteria

**Target Metrics**:
- ✅ **WebSocket Connection**: Establishes and maintains connection
- ✅ **Audio Recording**: Real-time microphone capture working
- ✅ **ElevenLabs Integration**: Audio sent and responses received
- ✅ **Latency Target**: End-to-end <1.5 seconds
- ✅ **Audio Playback**: AI responses play back clearly

## 🔧 Technical Details

**Audio Specifications**:
- **Format**: 16kHz, mono, 16-bit PCM
- **Chunk Size**: 250ms chunks (ElevenLabs requirement)
- **Encoding**: WebM/Opus → PCM16 → Base64

**WebSocket Protocol**:
- **Endpoint**: `wss://api.elevenlabs.io/v1/convai/conversation`
- **Authentication**: API key in URL parameters
- **Message Types**: Standard ElevenLabs ConvAI format

## 🎯 Validation Results

**This tool will tell you**:
- Can ElevenLabs achieve real-time conversation?
- What's the actual latency vs. targets?
- Is the audio quality sufficient for video integration?
- Should you proceed with HeyGen avatar development?

**Success = Proven technical feasibility**
**Failure = Clear data on why it won't work**

## 🚨 Troubleshooting

**Common Issues**:
- **WebSocket Connection Failed**: Check API key and agent ID
- **Audio Not Recording**: Grant microphone permissions in browser
- **No AI Responses**: Verify agent is properly configured in ElevenLabs

**Debug Mode**: Check browser console for detailed logging

---

**Purpose**: This is a validation tool, not a production application. It's designed to test ElevenLabs feasibility with minimal complexity.
