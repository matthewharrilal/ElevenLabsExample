import React, { useState, useEffect, useRef } from 'react';
import { useElevenLabsConversation } from './src/hooks/useElevenLabsConversation';
import { ConversationPerformanceMonitor } from './src/utils/performanceMonitor';

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
  const handleStartConversation = async () => {
    try {
      performanceMonitor.current.recordSessionStart();
      await startConversation();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      performanceMonitor.current.recordError(error);
    }
  };

  // Handle conversation end
  const handleEndConversation = () => {
    endConversation();
    console.log('Performance Report:', performanceMonitor.current.getMetricsReport());
  };

  // Monitor conversation messages for performance tracking
  useEffect(() => {
    if (latencyMetrics.totalResponses > 0) {
      performanceMonitor.current.recordResponse();
    }
  }, [latencyMetrics.totalResponses]);

  // VERIFIED: Status indicator colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'connecting': return '#FF9800';
      case 'disconnected': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="app" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Performance Display */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h3>Performance Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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

      {/* Conversation Controls */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div 
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(status),
              marginRight: '8px'
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
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Start Conversation
            </button>
          ) : (
            <button 
              onClick={handleEndConversation}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
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

      {/* Debug Information */}
      <details style={{ marginTop: '20px' }}>
        <summary>Debug Information</summary>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify({
            status,
            isConnected,
            isSpeaking,
            latencyMetrics,
            performanceReport: performanceMonitor.current.getMetricsReport()
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default App;
