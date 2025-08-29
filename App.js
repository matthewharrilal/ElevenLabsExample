import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useElevenLabsConversation } from './src/hooks/useElevenLabsConversation';
import { ConversationPerformanceMonitor } from './src/utils/performanceMonitor';
import { validateEnvironment, debugEnvironment } from './src/config/environment';

// Enhanced styles for better UX and visual organization
const STYLES = {
  app: { 
    padding: '20px', 
    maxWidth: '1400px', 
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderBottom: '3px solid #4CAF50'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '0 0 8px 0'
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: 0
  },
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  performanceContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginTop: '16px'
  },
  metricCard: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: '14px',
    color: '#6c757d',
    marginBottom: '8px',
    fontWeight: '500'
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  startButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
  },
  endButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)'
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px',
    display: 'inline-block'
  },
  debugContainer: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '12px',
    border: '1px solid #e9ecef',
    maxHeight: '300px',
    overflow: 'auto'
  },
  prdAssessment: {
    padding: '20px',
    backgroundColor: '#d4edda',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #28a745',
    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)'
  },
  prdWarning: {
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #ffc107',
    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)'
  },
  prdError: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #dc3545',
    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'
  },
  audioQualityContainer: {
    padding: '20px',
    backgroundColor: '#e3f2fd',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #2196F3',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)'
  },
  ratingButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '12px',
    justifyContent: 'center'
  },
  ratingButton: {
    padding: '10px 16px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minWidth: '40px'
  },
  ratingButtonActive: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
    transform: 'scale(1.05)'
  },
  exportButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(108, 117, 125, 0.3)'
  },
  errorContainer: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #dc3545',
    color: '#721c24',
    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'
  },
  warningContainer: {
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #ffc107',
    color: '#856404',
    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)'
  },
  conversationStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e9ecef'
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2c3e50'
  },
  speakingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#e8f5e8',
    borderRadius: '20px',
    color: '#2e7d32',
    fontSize: '14px',
    fontWeight: '500'
  },
  networkSelector: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e9ecef'
  },
  networkTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '12px'
  },
  scrollableSection: {
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#6c757d',
    fontSize: '14px',
    borderTop: '1px solid #e9ecef',
    marginTop: '40px'
  }
};

function App() {
  const [messages, setMessages] = useState([]);
  const [showAudioQualityRating, setShowAudioQualityRating] = useState(false);
  const [currentAudioRating, setCurrentAudioRating] = useState(null);
  const [audioIssues, setAudioIssues] = useState([]);
  const [networkCondition, setNetworkCondition] = useState('excellent');
  const [environmentValid, setEnvironmentValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const performanceMonitor = useRef(new ConversationPerformanceMonitor());
  
  // Validate environment on mount
  useEffect(() => {
    try {
      debugEnvironment();
      const isValid = validateEnvironment();
      setEnvironmentValid(isValid);
      
      if (!isValid) {
        setErrorMessage('Environment configuration is incomplete. Please check your .env file and ensure ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID are set.');
      }
    } catch (error) {
      console.error('Environment validation error:', error);
      setEnvironmentValid(false);
      setErrorMessage(`Environment validation failed: ${error.message}`);
    }
  }, []);
  
  // Use the VERIFIED SDK integration
  const {
    startConversation,
    endConversation,
    isConnected,
    status,
    isSpeaking,
    latencyMetrics,
    connectionMetrics,
    audioQualityMetrics,
    getConversationDuration,
    getPerformanceReport,
    exportPerformanceData,
    setPerformanceMonitor,
    rateAudioQuality,
    recordNetworkCondition,
    conversation
  } = useElevenLabsConversation();

  // Connect performance monitor
  useEffect(() => {
    setPerformanceMonitor(performanceMonitor.current);
  }, [setPerformanceMonitor]);

  // Handle conversation start
  const handleStartConversation = useCallback(async () => {
    try {
      if (!environmentValid) {
        throw new Error('Environment not configured. Please check your .env file.');
      }
      
      setErrorMessage(null);
      performanceMonitor.current.recordSessionStart();
      await startConversation();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setErrorMessage(`Failed to start conversation: ${error.message}`);
      performanceMonitor.current.recordError(error);
    }
  }, [startConversation, environmentValid]);

  // Handle conversation end
  const handleEndConversation = useCallback(() => {
    try {
      endConversation();
      const report = performanceMonitor.current.getMetricsReport();
      console.log('Performance Report:', report);
      
      // Show final performance summary
      if (report) {
        alert(`Performance Summary:\n\n` +
          `Session Duration: ${Math.round(report.sessionDuration / 1000)}s\n` +
          `Total Responses: ${report.totalResponses}\n` +
          `Average Latency: ${report.latencyMetrics ? Math.round(report.latencyMetrics.average) : 'N/A'}ms\n` +
          `Connection Uptime: ${report.connectionMetrics ? (report.connectionMetrics.uptimePercentage * 100).toFixed(1) : 'N/A'}%\n` +
          `PRD Status: ${report.prdAssessment?.status || 'Unknown'}\n\n` +
          `Check console for detailed report.`
        );
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
      setErrorMessage(`Error ending conversation: ${error.message}`);
    }
  }, [endConversation]);

  // Monitor conversation messages for performance tracking
  useEffect(() => {
    if (latencyMetrics.totalResponses > 0) {
      performanceMonitor.current.recordResponse();
      
      // Show audio quality rating prompt after each response
      if (isConnected && !isSpeaking) {
        setShowAudioQualityRating(true);
      }
    }
  }, [latencyMetrics.totalResponses, isConnected, isSpeaking]);

  // Handle audio quality rating
  const handleAudioQualityRating = useCallback((rating) => {
    setCurrentAudioRating(rating);
  }, []);

  const handleAudioIssueToggle = useCallback((issue) => {
    setAudioIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  }, []);

  const submitAudioQualityRating = useCallback(() => {
    if (currentAudioRating) {
      rateAudioQuality(currentAudioRating, audioIssues);
      setShowAudioQualityRating(false);
      setCurrentAudioRating(null);
      setAudioIssues([]);
    }
  }, [currentAudioRating, audioIssues, rateAudioQuality]);

  // Handle network condition change
  const handleNetworkConditionChange = useCallback((condition) => {
    setNetworkCondition(condition);
    recordNetworkCondition(condition, {
      speed: condition === 'excellent' ? '5G/WiFi' : condition === 'good' ? '4G' : condition === 'poor' ? '3G' : '2G',
      estimatedLatency: condition === 'excellent' ? 20 : condition === 'good' ? 50 : condition === 'poor' ? 150 : 300
    });
  }, [recordNetworkCondition]);

  // Export performance data
  const handleExportData = useCallback(() => {
    try {
      const data = exportPerformanceData();
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setErrorMessage(`Error exporting data: ${error.message}`);
    }
  }, [exportPerformanceData]);

  // VERIFIED: Status indicator colors
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'connecting': return '#FF9800';
      case 'disconnected': return '#f44336';
      default: return '#9E9E9E';
    }
  }, []);

  // Get PRD assessment styling
  const getPRDStyling = useCallback((assessment) => {
    if (!assessment) return STYLES.performanceContainer;
    
    switch (assessment.status) {
      case 'fully_compliant':
        return STYLES.prdAssessment;
      case 'mostly_compliant':
        return STYLES.prdWarning;
      case 'partially_compliant':
      case 'non_compliant':
        return STYLES.prdError;
      default:
        return STYLES.performanceContainer;
    }
  }, []);

  // Memoized environment status display
  const environmentStatusDisplay = useMemo(() => {
    if (environmentValid === null) {
      return (
        <div style={STYLES.warningContainer}>
          <h3>🔍 Environment Status</h3>
          <div>Checking environment configuration...</div>
        </div>
      );
    }
    
    if (!environmentValid) {
      return (
        <div style={STYLES.errorContainer}>
          <h3>❌ Environment Configuration Error</h3>
          <div>{errorMessage || 'Environment configuration is incomplete.'}</div>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            Please create a .env file with ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID variables.
          </div>
        </div>
      );
    }
    
    return (
      <div style={STYLES.prdAssessment}>
        <h3>✅ Environment Status</h3>
        <div>Environment configured successfully</div>
        <div style={{ fontSize: '14px', marginTop: '4px' }}>
          Ready to start performance testing
        </div>
      </div>
    );
  }, [environmentValid, errorMessage]);

  // Memoized PRD compliance display
  const prdComplianceDisplay = useMemo(() => {
    if (!environmentValid) return null;
    
    const report = getPerformanceReport();
    if (!report || !report.prdAssessment) return null;

    const assessment = report.prdAssessment;
    const styling = getPRDStyling(assessment);

    return (
      <div style={styling}>
        <h3>📊 PRD Compliance Assessment</h3>
        <div style={{ marginBottom: '12px' }}>
          <strong>Status:</strong> {assessment.status.replace('_', ' ').toUpperCase()}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Message:</strong> {assessment.message}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Compliance Score:</strong> {(assessment.complianceScore * 100).toFixed(0)}%
        </div>
        {assessment.details && (
          <div style={STYLES.metricsGrid}>
            {Object.entries(assessment.details).map(([key, detail]) => (
              <div key={key} style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>{key.replace('_', ' ')}</div>
                <div style={{ 
                  color: detail.compliant ? 'green' : 'red',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {detail.compliant ? '✓' : '✗'} {detail.rating}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Target: {detail.target} | Actual: {detail.actual}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [environmentValid, getPerformanceReport, getPRDStyling]);

  // Memoized enhanced performance metrics display
  const performanceDisplay = useMemo(() => {
    if (!environmentValid) return null;
    
    const report = getPerformanceReport();
    
    return (
      <div style={STYLES.performanceContainer}>
        <h3 style={STYLES.cardTitle}>📈 Performance Metrics</h3>
        <div style={STYLES.metricsGrid}>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Conversation Duration</div>
            <div style={STYLES.metricValue}>
              {isConnected ? `${Math.floor(getConversationDuration() / 1000)}s` : 'N/A'}
            </div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>First Response Time</div>
            <div style={STYLES.metricValue}>
              {latencyMetrics.firstResponseTime ? `${Math.round(latencyMetrics.firstResponseTime)}ms` : 'N/A'}
            </div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Average Response Time</div>
            <div style={STYLES.metricValue}>
              {latencyMetrics.averageResponseTime ? `${Math.round(latencyMetrics.averageResponseTime)}ms` : 'N/A'}
            </div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Total Responses</div>
            <div style={STYLES.metricValue}>{latencyMetrics.totalResponses}</div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Latency Target</div>
            <div style={{ 
              color: latencyMetrics.isLatencyAcceptable === null ? 'gray' : latencyMetrics.isLatencyAcceptable ? 'green' : 'red',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {latencyMetrics.isLatencyAcceptable === null ? 'Measuring...' : latencyMetrics.isLatencyAcceptable ? 'PASS (<1.5s)' : 'FAIL (>1.5s)'}
            </div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Connection Uptime</div>
            <div style={STYLES.metricValue}>
              {connectionMetrics.uptimePercentage ? `${(connectionMetrics.uptimePercentage * 100).toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Disconnections</div>
            <div style={STYLES.metricValue}>{connectionMetrics.disconnectionCount}</div>
          </div>
          <div style={STYLES.metricCard}>
            <div style={STYLES.metricLabel}>Audio Quality (Avg)</div>
            <div style={STYLES.metricValue}>
              {audioQualityMetrics.averageRating ? `${audioQualityMetrics.averageRating.toFixed(1)}/10` : 'N/A'}
            </div>
          </div>
        </div>
        
        {/* Enhanced latency metrics if available */}
        {report?.latencyMetrics && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50' }}>📊 Detailed Latency Analysis</h4>
            <div style={STYLES.metricsGrid}>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>Min</div>
                <div style={STYLES.metricValue}>{Math.round(report.latencyMetrics.min)}ms</div>
              </div>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>Median</div>
                <div style={STYLES.metricValue}>{Math.round(report.latencyMetrics.median)}ms</div>
              </div>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>95th Percentile</div>
                <div style={STYLES.metricValue}>{Math.round(report.latencyMetrics.p95)}ms</div>
              </div>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>Max</div>
                <div style={STYLES.metricValue}>{Math.round(report.latencyMetrics.max)}ms</div>
              </div>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>Std Dev</div>
                <div style={STYLES.metricValue}>{Math.round(report.latencyMetrics.standardDeviation)}ms</div>
              </div>
              <div style={STYLES.metricCard}>
                <div style={STYLES.metricLabel}>Consistency</div>
                <div style={STYLES.metricValue}>{report.latencyMetrics.consistency}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [environmentValid, isConnected, getConversationDuration, latencyMetrics, connectionMetrics, audioQualityMetrics, getPerformanceReport]);

  // Memoized audio quality rating interface
  const audioQualityInterface = useMemo(() => {
    if (!showAudioQualityRating || !environmentValid) return null;

    const issues = ['cutout', 'static', 'volume_drop', 'delay', 'distortion'];

    return (
      <div style={STYLES.audioQualityContainer}>
        <h4 style={STYLES.cardTitle}>🎵 Rate Audio Quality for Last Response</h4>
        <div style={{ marginBottom: '12px', fontSize: '16px' }}>
          How clear was the AI's voice? (1-10)
        </div>
        <div style={STYLES.ratingButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
            <button
              key={rating}
              style={{
                ...STYLES.ratingButton,
                ...(currentAudioRating === rating && STYLES.ratingButtonActive)
              }}
              onClick={() => handleAudioQualityRating(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
        
        {currentAudioRating && (
          <>
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '16px' }}>
                Any audio issues? (select all that apply)
              </div>
              <div style={STYLES.ratingButtons}>
                {issues.map(issue => (
                  <button
                    key={issue}
                    style={{
                      ...STYLES.ratingButton,
                      ...(audioIssues.includes(issue) && STYLES.ratingButtonActive)
                    }}
                    onClick={() => handleAudioIssueToggle(issue)}
                  >
                    {issue.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <button
              style={STYLES.startButton}
              onClick={submitAudioQualityRating}
            >
              Submit Rating
            </button>
          </>
        )}
      </div>
    );
  }, [showAudioQualityRating, environmentValid, currentAudioRating, audioIssues, handleAudioQualityRating, handleAudioIssueToggle, submitAudioQualityRating]);

  // Memoized network condition selector
  const networkConditionSelector = useMemo(() => {
    if (!environmentValid) return null;
    
    return (
      <div style={STYLES.networkSelector}>
        <div style={STYLES.networkTitle}>🌐 Network Condition: {networkCondition}</div>
        <div style={STYLES.ratingButtons}>
          {['excellent', 'good', 'poor', 'very_poor'].map(condition => (
            <button
              key={condition}
              style={{
                ...STYLES.ratingButton,
                ...(networkCondition === condition && STYLES.ratingButtonActive)
              }}
              onClick={() => handleNetworkConditionChange(condition)}
            >
              {condition.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    );
  }, [environmentValid, networkCondition, handleNetworkConditionChange]);

  // Memoized conversation controls
  const conversationControls = useMemo(() => {
    if (!environmentValid) return null;
    
    return (
      <div style={STYLES.card}>
        <h3 style={STYLES.cardTitle}>🎤 Conversation Controls</h3>
        
        <div style={STYLES.conversationStatus}>
          <div style={STYLES.statusInfo}>
            <div 
              style={{ 
                ...STYLES.statusIndicator,
                backgroundColor: getStatusColor(status)
              }}
            />
            <span style={STYLES.statusText}>Status: {status}</span>
          </div>
          {isSpeaking && (
            <div style={STYLES.speakingIndicator}>
              🎤 Agent Speaking...
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          {!isConnected ? (
            <button 
              onClick={handleStartConversation}
              style={STYLES.startButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Start Conversation
            </button>
          ) : (
            <button 
              onClick={handleEndConversation}
              style={STYLES.endButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              End Conversation
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', color: '#6c757d' }}>
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
    );
  }, [environmentValid, status, isConnected, isSpeaking, getStatusColor, handleStartConversation, handleEndConversation]);

  // Memoized debug information
  const debugInfo = useMemo(() => ({
    status,
    isConnected,
    isSpeaking,
    latencyMetrics,
    connectionMetrics,
    audioQualityMetrics,
    performanceReport: getPerformanceReport(),
    environmentValid,
    errorMessage
  }), [status, isConnected, isSpeaking, latencyMetrics, connectionMetrics, audioQualityMetrics, getPerformanceReport, environmentValid, errorMessage]);

  return (
    <div className="app" style={STYLES.app}>
      {/* Header */}
      <div style={STYLES.header}>
        <h1 style={STYLES.headerTitle}>ElevenLabs Performance Testing Tool</h1>
        <p style={STYLES.headerSubtitle}>
          Comprehensive performance measurement and PRD compliance assessment
        </p>
      </div>

      {/* Environment Status Display */}
      {environmentStatusDisplay}

      {/* Main Content Grid */}
      <div style={STYLES.mainContainer}>
        {/* Left Column */}
        <div style={STYLES.leftColumn}>
          {/* PRD Compliance Display */}
          {prdComplianceDisplay}

          {/* Performance Display */}
          {performanceDisplay}

          {/* Audio Quality Rating Interface */}
          {audioQualityInterface}
        </div>

        {/* Right Column */}
        <div style={STYLES.rightColumn}>
          {/* Network Condition Selector */}
          {networkConditionSelector}

          {/* Conversation Controls */}
          {conversationControls}

          {/* Export Button */}
          {environmentValid && (
            <div style={STYLES.card}>
              <h3 style={STYLES.cardTitle}>📊 Export Data</h3>
              <button 
                style={STYLES.exportButton}
                onClick={handleExportData}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Export Performance Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Information */}
      <div style={STYLES.card}>
        <h3 style={STYLES.cardTitle}>🐛 Debug Information</h3>
        <div style={STYLES.scrollableSection}>
          <pre style={STYLES.debugContainer}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div style={STYLES.footer}>
        <p>ElevenLabs Performance Testing Tool • Built for comprehensive performance measurement</p>
      </div>
    </div>
  );
}

export default App;
