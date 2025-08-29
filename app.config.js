import 'dotenv/config';

export default {
  expo: {
    name: "ElevenLabsExample",
    slug: "ElevenLabsExample",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
      ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID,
      ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
      ELEVENLABS_LANGUAGE: process.env.ELEVENLABS_LANGUAGE,
      ELEVENLABS_MAX_RECONNECTION_ATTEMPTS: process.env.ELEVENLABS_MAX_RECONNECTION_ATTEMPTS,
      ELEVENLABS_BASE_RECONNECTION_DELAY: process.env.ELEVENLABS_BASE_RECONNECTION_DELAY,
      ELEVENLABS_MAX_RECONNECTION_DELAY: process.env.ELEVENLABS_MAX_RECONNECTION_DELAY,
      ELEVENLABS_SAMPLE_RATE: process.env.ELEVENLABS_SAMPLE_RATE,
      ELEVENLABS_CHANNELS: process.env.ELEVENLABS_CHANNELS,
      ELEVENLABS_BITS_PER_SAMPLE: process.env.ELEVENLABS_BITS_PER_SAMPLE,
      ELEVENLABS_CHUNK_DURATION_MS: process.env.ELEVENLABS_CHUNK_DURATION_MS,
      ELEVENLABS_MAX_LATENCY_MS: process.env.ELEVENLABS_MAX_LATENCY_MS,
      ELEVENLABS_MIN_UPTIME_PERCENT: process.env.ELEVENLABS_MIN_UPTIME_PERCENT,
      ELEVENLABS_MIN_SUCCESS_RATE: process.env.ELEVENLABS_MIN_SUCCESS_RATE,
    }
  }
};
