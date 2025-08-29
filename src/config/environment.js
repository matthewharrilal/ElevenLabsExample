import Constants from 'expo-constants';

// Environment Configuration for ElevenLabs React SDK
// All values sourced from Expo config extra

export const ENVIRONMENT_CONFIG = {
  // ElevenLabs API Credentials
  ELEVENLABS_API_KEY: Constants.expoConfig?.extra?.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY,
  ELEVENLABS_AGENT_ID: Constants.expoConfig?.extra?.ELEVENLABS_AGENT_ID || process.env.ELEVENLABS_AGENT_ID,
  
  // Development Settings
  IS_DEVELOPMENT: Constants.expoConfig?.extra?.NODE_ENV === 'development' || process.env.NODE_ENV === 'development',
  ENABLE_DEBUG_LOGGING: Constants.expoConfig?.extra?.NODE_ENV === 'development' || process.env.NODE_ENV === 'development',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const missingVars = [];
  
  if (!ENVIRONMENT_CONFIG.ELEVENLABS_API_KEY) {
    missingVars.push('ELEVENLABS_API_KEY');
  }
  
  if (!ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID) {
    missingVars.push('ELEVENLABS_AGENT_ID');
  }
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    console.warn('Please check your .env file or Expo configuration');
    return false;
  }
  
  return true;
};

// Debug function to show current environment state
export const debugEnvironment = () => {
  if (ENVIRONMENT_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.log('Environment Configuration:', {
      hasApiKey: !!ENVIRONMENT_CONFIG.ELEVENLABS_API_KEY,
      hasAgentId: !!ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID,
      isDevelopment: ENVIRONMENT_CONFIG.IS_DEVELOPMENT,
      constantsLoaded: !!Constants.expoConfig,
      envVars: {
        ELEVENLABS_API_KEY: ENVIRONMENT_CONFIG.ELEVENLABS_API_KEY ? '***SET***' : 'NOT SET',
        ELEVENLABS_AGENT_ID: ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID ? '***SET***' : 'NOT SET'
      }
    });
  }
};
