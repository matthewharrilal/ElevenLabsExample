import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useElevenLabsConversation } from './src/hooks/useElevenLabsConversation';
import { ConversationPerformanceMonitor } from './src/utils/performanceMonitor';

// Extracted styles for better performance
const STYLES = {
  app: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  performanceContainer: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  startButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  endButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px'
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px'
  }
};

function App() {
  const [messages, setMessages] = useState([]);
  const performanceMonitor = useRef(new ConversationPerformanceMonitor());
  
  // Use the VERIFIED SDK integration
  const {
    startConversation,
    endConversation,
    isConnected,
    status,
    isSpeaking,
    latencyMetrics,
    getConversationDuration,
    conversation
  } = useElevenLabsConversation();

  // Handle conversation start
  const handleStartConversation = useCallback(async () => {
    try {
      performanceMonitor.current.recordSessionStart();
      await startConversation();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      performanceMonitor.current.recordError(error);
    }
  }, [startConversation]);

  // Handle conversation end
  const handleEndConversation = useCallback(() => {
    endConversation();
    console.log('Performance Report:', performanceMonitor.current.getMetricsReport());
  }, [endConversation]);

  // Monitor conversation messages for performance tracking
  useEffect(() => {
    if (latencyMetrics.totalResponses > 0) {
      performanceMonitor.current.recordResponse();
    }
  }, [latencyMetrics.totalResponses]);

  // VERIFIED: Status indicator colors
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'connecting': return '#FF9800';
      case 'disconnected': return '#f44336';
      default: return '#9E9E9E';
    }
  }, []);

  // Memoized performance metrics display
  const performanceDisplay = useMemo(() => (
    <div style={STYLES.performanceContainer}>
      <h3>Performance Metrics</h3>
      <div style={STYLES.metricsGrid}>
        <div>
          <div>Conversation Duration</div>
          <div>{isConnected ? `${Math.floor(getConversationDuration() / 1000)}s` : 'N/A'}</div>
        </div>
        <div>
          <div>First Response Time</div>
          <div>{latencyMetrics.firstResponseTime ? `${Math.round(latencyMetrics.firstResponseTime)}ms` : 'N/A'}</div>
        </div>
        <div>
          <div>Average Response Time</div>
          <div>{latencyMetrics.averageResponseTime ? `${Math.round(latencyMetrics.averageResponseTime)}ms` : 'N/A'}</div>
        </div>
        <div>
          <div>Total Responses</div>
          <div>{latencyMetrics.totalResponses}</div>
        </div>
        <div>
          <div>Latency Target</div>
          <div style={{ 
            color: latencyMetrics.isLatencyAcceptable === null ? 'gray' : latencyMetrics.isLatencyAcceptable ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {latencyMetrics.isLatencyAcceptable === null ? 'Measuring...' : latencyMetrics.isLatencyAcceptable ? 'PASS (<1.5s)' : 'FAIL (>1.5s)'}
          </div>
        </div>
      </div>
    </div>
  ), [isConnected, getConversationDuration, latencyMetrics]);

  // Memoized conversation controls
  const conversationControls = useMemo(() => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div 
          style={{ 
            ...STYLES.statusIndicator,
            backgroundColor: getStatusColor(status)
          }}
        />
        <span>Status: {status}</span>
        {isSpeaking && (
          <span style={{ marginLeft: '16px' }}>
            🎤 Agent Speaking...
          </span>
        )}
      </div>

      <div>
        {!isConnected ? (
          <button 
            onClick={handleStartConversation}
            style={STYLES.startButton}
          >
            Start Conversation
          </button>
        ) : (
          <button 
            onClick={handleEndConversation}
            style={STYLES.endButton}
          >
            End Conversation
          </button>
        )}
      </div>

      <div style={{ marginTop: '16px' }}>
        {!isConnected && (
          <p>Click "Start Conversation" to begin talking with the AI agent.</p>
        )}
        {isConnected && !isSpeaking && (
          <p>You can speak now - the agent is listening.</p>
        )}
        {isConnected && isSpeaking && (
          <p>Agent is responding - you can interrupt at any time.</p>
        )}
      </div>
    </div>
  ), [status, isConnected, isSpeaking, getStatusColor, handleStartConversation, handleEndConversation]);

  // Memoized debug information
  const debugInfo = useMemo(() => ({
    status,
    isConnected,
    isSpeaking,
    latencyMetrics,
    performanceReport: performanceMonitor.current.getMetricsReport()
  }), [status, isConnected, isSpeaking, latencyMetrics]);

  return (
    <div className="app" style={STYLES.app}>
      {/* Performance Display */}
      {performanceDisplay}

      {/* Conversation Controls */}
      {conversationControls}

      {/* Debug Information */}
      <details style={{ marginTop: '20px' }}>
        <summary>Debug Information</summary>
        <pre style={STYLES.debugContainer}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default App;
