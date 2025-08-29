import { useConversation } from '@elevenlabs/react';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ENVIRONMENT_CONFIG, validateEnvironment, debugEnvironment } from '../config/environment';

export const useElevenLabsConversation = () => {
  // Performance tracking state
  const [latencyMetrics, setLatencyMetrics] = useState({
    sessionStart: null,
    firstResponse: null,
    responses: [],
    averageLatency: null
  });

  // Audio quality tracking
  const [audioQualityRatings, setAudioQualityRatings] = useState([]);
  
  // Connection stability tracking
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    lastDisconnect: null,
    disconnectionCount: 0,
    reconnectionAttempts: 0
  });

  // Performance monitor reference
  const performanceMonitor = useRef(null);
  
  // Store conversation reference to avoid circular dependency
  const conversationRef = useRef(null);

  // Debug environment on mount
  useEffect(() => {
    debugEnvironment();
  }, []);

  // VERIFIED: SDK handles all WebSocket connections, audio, and conversation management
  const conversation = useConversation({
    // VERIFIED: Event handlers for conversation lifecycle
    onConnect: useCallback(() => {
      console.log('ElevenLabs conversation connected');
      const connectTime = performance.now();
      
      setLatencyMetrics(prev => ({ 
        ...prev, 
        sessionStart: connectTime 
      }));
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        reconnectionAttempts: prev.reconnectionAttempts + 1
      }));

      // Record connection event in performance monitor
      if (performanceMonitor.current) {
        performanceMonitor.current.recordConnectionEvent('connected');
      }
    }, []),

    onDisconnect: useCallback(() => {
      console.log('ElevenLabs conversation disconnected');
      const disconnectTime = performance.now();
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: false,
        lastDisconnect: disconnectTime,
        disconnectionCount: prev.disconnectionCount + 1
      }));

      // Record disconnection event in performance monitor
      if (performanceMonitor.current) {
        performanceMonitor.current.recordConnectionEvent('disconnected');
      }
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

      // Record response in performance monitor with enhanced data
      if (performanceMonitor.current) {
        const responseData = {
          messageLength: message.text?.length || 0,
          audioDuration: message.audio?.duration || 0,
          messageType: message.type || 'unknown',
          timestamp: responseTime
        };
        performanceMonitor.current.recordResponse(responseData);
      }
    }, []),

    onError: useCallback((error) => {
      console.error('ElevenLabs conversation error:', error);
      
      // Record error in performance monitor
      if (performanceMonitor.current) {
        performanceMonitor.current.recordError(error, {
          context: 'conversation_error',
          conversationStatus: conversationRef.current?.status || 'unknown'
        });
      }
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

  // Store conversation reference when it's available
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // VERIFIED: Simplified conversation management - SDK handles complexity
  const startConversation = useCallback(async () => {
    try {
      // Validate environment configuration first
      if (!validateEnvironment()) {
        throw new Error('Environment configuration is incomplete. Please check your .env file and ensure ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID are set.');
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
      
      // Record error in performance monitor
      if (performanceMonitor.current) {
        performanceMonitor.current.recordError(error, {
          context: 'start_conversation_failed'
        });
      }
      
      throw error;
    }
  }, [conversation]);

  // VERIFIED: End conversation method
  const endConversation = useCallback(() => {
    if (conversationRef.current) {
      conversationRef.current.endSession();
    }
    setLatencyMetrics({
      sessionStart: null,
      firstResponse: null,
      responses: [],
      averageLatency: null
    });
    setAudioQualityRatings([]);
    setConnectionStatus({
      isConnected: false,
      lastDisconnect: null,
      disconnectionCount: 0,
      reconnectionAttempts: 0
    });
  }, []);

  // Audio quality rating function
  const rateAudioQuality = useCallback((rating, issues = []) => {
    if (rating < 1 || rating > 10) {
      console.warn('Audio quality rating must be between 1 and 10');
      return;
    }
    
    const ratingData = {
      rating,
      issues,
      timestamp: performance.now(),
      responseIndex: latencyMetrics.responses.length
    };
    
    setAudioQualityRatings(prev => [...prev, ratingData]);
    
    // Record in performance monitor
    if (performanceMonitor.current) {
      performanceMonitor.current.recordAudioQuality(rating, issues);
    }
  }, [latencyMetrics.responses.length]);

  // Network condition recording
  const recordNetworkCondition = useCallback((condition, details = {}) => {
    if (performanceMonitor.current) {
      performanceMonitor.current.recordNetworkCondition(condition, details);
    }
  }, []);

  // Set performance monitor reference
  const setPerformanceMonitor = useCallback((monitor) => {
    performanceMonitor.current = monitor;
  }, []);

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
      },
      connectionMetrics: {
        ...connectionStatus,
        uptimePercentage: sessionStart ? 
          ((performance.now() - sessionStart) - (connectionStatus.lastDisconnect ? 
            (performance.now() - connectionStatus.lastDisconnect) : 0)) / (performance.now() - sessionStart) : 1
      },
      audioQualityMetrics: {
        totalRatings: audioQualityRatings.length,
        averageRating: audioQualityRatings.length > 0 ? 
          audioQualityRatings.reduce((sum, r) => sum + r.rating, 0) / audioQualityRatings.length : null,
        recentRating: audioQualityRatings.length > 0 ? audioQualityRatings[audioQualityRatings.length - 1].rating : null
      }
    };
  }, [conversation.status, conversation.isSpeaking, latencyMetrics, connectionStatus, audioQualityRatings]);

  // Calculate conversation duration
  const getConversationDuration = useCallback(() => {
    if (!latencyMetrics.sessionStart) return 0;
    return performance.now() - latencyMetrics.sessionStart;
  }, [latencyMetrics.sessionStart]);

  // Get comprehensive performance report
  const getPerformanceReport = useCallback(() => {
    if (performanceMonitor.current) {
      return performanceMonitor.current.getMetricsReport();
    }
    return null;
  }, []);

  // Export performance data
  const exportPerformanceData = useCallback(() => {
    if (performanceMonitor.current) {
      return performanceMonitor.current.getExportData();
    }
    return null;
  }, []);

  return {
    // Core conversation controls (SDK managed)
    startConversation,
    endConversation,
    
    // Status and metrics
    ...performanceMetrics,
    
    // Additional utility functions
    getConversationDuration,
    getPerformanceReport,
    exportPerformanceData,
    
    // Performance monitoring
    setPerformanceMonitor,
    rateAudioQuality,
    recordNetworkCondition,
    
    // SDK's built-in state
    conversation
  };
};
