import Constants from 'expo-constants';

// Environment Configuration for ElevenLabs React SDK
// All values sourced from Expo config extra

export const ENVIRONMENT_CONFIG = {
  // ElevenLabs API Credentials
  ELEVENLABS_API_KEY: Constants.expoConfig?.extra?.ELEVENLABS_API_KEY,
  ELEVENLABS_AGENT_ID: Constants.expoConfig?.extra?.ELEVENLABS_AGENT_ID,
  
  // Voice Configuration
  ELEVENLABS_VOICE_ID: Constants.expoConfig?.extra?.ELEVENLABS_VOICE_ID,
  ELEVENLABS_LANGUAGE: Constants.expoConfig?.extra?.ELEVENLABS_LANGUAGE || 'en',
  
  // Performance Targets
  ELEVENLABS_MAX_LATENCY_MS: parseInt(Constants.expoConfig?.extra?.ELEVENLABS_MAX_LATENCY_MS) || 1500,
  ELEVENLABS_MIN_UPTIME_PERCENT: parseInt(Constants.expoConfig?.extra?.ELEVENLABS_MIN_UPTIME_PERCENT) || 95,
  ELEVENLABS_MIN_SUCCESS_RATE: parseInt(Constants.expoConfig?.extra?.ELEVENLABS_MIN_SUCCESS_RATE) || 80,
  
  // Performance Monitoring
  ENABLE_PERFORMANCE_MONITORING: true,
  METRICS_UPDATE_INTERVAL: 5000,
  
  // Development Settings
  IS_DEVELOPMENT: Constants.expoConfig?.extra?.NODE_ENV === 'development',
  ENABLE_DEBUG_LOGGING: Constants.expoConfig?.extra?.NODE_ENV === 'development',
};

// Credentials from environment variables
export const CREDENTIALS = {
  API_KEY: Constants.expoConfig?.extra?.ELEVENLABS_API_KEY,
  AGENT_ID: Constants.expoConfig?.extra?.ELEVENLABS_AGENT_ID,
};

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const required = ['ELEVENLABS_AGENT_ID'];
  const missing = required.filter(key => !Constants.expoConfig?.extra?.[key] && !ENVIRONMENT_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please check your .env file and app.config.js');
    return false;
  }
  
  console.log('✅ Environment variables loaded successfully');
  console.log('🔑 API Key:', Constants.expoConfig?.extra?.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing (optional for public agents)');
  console.log('🤖 Agent ID:', ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID ? '✅ Set' : '❌ Missing');
  console.log('🎤 Voice ID:', ENVIRONMENT_CONFIG.ELEVENLABS_VOICE_ID ? '✅ Set' : '❌ Missing');
  
  return true;
};
