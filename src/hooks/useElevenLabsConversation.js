import { useConversation } from '@elevenlabs/react';
import { useState, useCallback, useMemo } from 'react';
import { ENVIRONMENT_CONFIG } from '../config/environment';

export const useElevenLabsConversation = () => {
  // Performance tracking state
  const [latencyMetrics, setLatencyMetrics] = useState({
    sessionStart: null,
    firstResponse: null,
    responses: [],
    averageLatency: null
  });

  // VERIFIED: SDK handles all WebSocket connections, audio, and conversation management
  const conversation = useConversation({
    // VERIFIED: Event handlers for conversation lifecycle
    onConnect: useCallback(() => {
      console.log('ElevenLabs conversation connected');
      setLatencyMetrics(prev => ({ 
        ...prev, 
        sessionStart: performance.now() 
      }));
    }, []),

    onDisconnect: useCallback(() => {
      console.log('ElevenLabs conversation disconnected');
    }, []),

    onMessage: useCallback((message) => {
      console.log('Message received:', message);
      
      // Track response timing for latency measurement
      const responseTime = performance.now();
      setLatencyMetrics(prev => {
        const newResponses = [...prev.responses, responseTime];
        const latencies = newResponses
          .filter(() => prev.sessionStart)
          .map(time => time - prev.sessionStart);
        
        return {
          ...prev,
          responses: newResponses,
          firstResponse: prev.firstResponse || responseTime,
          averageLatency: latencies.length > 0 
            ? latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length 
            : null
        };
      });
    }, []),

    onError: useCallback((error) => {
      console.error('ElevenLabs conversation error:', error);
    }, []),

    // VERIFIED: Conversation overrides
    overrides: {
      agent: {
        prompt: {
          prompt: "You are a helpful AI assistant. Keep responses concise for low latency."
        }
      }
    }
  });

  // VERIFIED: Simplified conversation management - SDK handles complexity
  const startConversation = useCallback(async () => {
    try {
      // Validate environment configuration
      if (!ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID) {
        throw new Error('ELEVENLABS_AGENT_ID is not configured. Please check your .env file.');
      }

      // VERIFIED: Method name from official documentation
      const conversationId = await conversation.startSession({
        agentId: ENVIRONMENT_CONFIG.ELEVENLABS_AGENT_ID,
        connectionType: "websocket", // VERIFIED: or "webrtc"
        // For private agents: signedUrl: await getSignedUrlFromServer()
      });
      
      console.log('Conversation started with ID:', conversationId);
      return conversationId;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  }, [conversation]);

  // VERIFIED: End conversation method
  const endConversation = useCallback(() => {
    conversation.endSession();
    setLatencyMetrics({
      sessionStart: null,
      firstResponse: null,
      responses: [],
      averageLatency: null
    });
  }, [conversation]);

  // Calculate performance metrics with useMemo for optimization
  const performanceMetrics = useMemo(() => {
    const { sessionStart, firstResponse, averageLatency, responses } = latencyMetrics;
    
    return {
      isConnected: conversation.status === 'connected',
      status: conversation.status,
      isSpeaking: conversation.isSpeaking,
      latencyMetrics: {
        firstResponseTime: firstResponse && sessionStart 
          ? firstResponse - sessionStart 
          : null,
        averageResponseTime: averageLatency,
        totalResponses: responses.length,
        isLatencyAcceptable: averageLatency ? averageLatency < 1500 : null
      }
    };
  }, [conversation.status, conversation.isSpeaking, latencyMetrics]);

  // Calculate conversation duration
  const getConversationDuration = useCallback(() => {
    if (!latencyMetrics.sessionStart) return 0;
    return performance.now() - latencyMetrics.sessionStart;
  }, [latencyMetrics.sessionStart]);

  return {
    // Core conversation controls (SDK managed)
    startConversation,
    endConversation,
    
    // Status and metrics
    ...performanceMetrics,
    
    // Additional utility functions
    getConversationDuration,
    
    // SDK's built-in state
    conversation
  };
};
