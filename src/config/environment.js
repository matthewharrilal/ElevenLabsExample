import Constants from 'expo-constants';

// Environment Configuration for ElevenLabs React SDK
// All values sourced from Expo config extra

export const ENVIRONMENT_CONFIG = {
  // ElevenLabs API Credentials
  ELEVENLABS_API_KEY: Constants.expoConfig?.extra?.ELEVENLABS_API_KEY,
  ELEVENLABS_AGENT_ID: Constants.expoConfig?.extra?.ELEVENLABS_AGENT_ID,
  
  // Development Settings
  IS_DEVELOPMENT: Constants.expoConfig?.extra?.NODE_ENV === 'development',
  ENABLE_DEBUG_LOGGING: Constants.expoConfig?.extra?.NODE_ENV === 'development',
};
