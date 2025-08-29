export class ConversationPerformanceMonitor {
  constructor() {
    this.metrics = {
      sessionStart: null,
      responses: [],
      errors: [],
      connectionEvents: [],
      audioQuality: [],
      conversationFlow: [],
      networkConditions: []
    };
    
    // Performance thresholds
    this.thresholds = {
      latency: {
        excellent: 800,    // <800ms
        good: 1200,        // 800-1200ms
        acceptable: 1500,  // 1200-1500ms (PRD target)
        poor: 2000        // >2000ms
      },
      connection: {
        excellent: 0.99,   // 99%+ uptime
        good: 0.95,        // 95-99% uptime
        acceptable: 0.90,  // 90-95% uptime
        poor: 0.90         // <90% uptime
      },
      audioQuality: {
        excellent: 9,      // 9-10 rating
        good: 7,           // 7-9 rating
        acceptable: 5,     // 5-7 rating
        poor: 5            // <5 rating
      }
    };
  }

  recordSessionStart() {
    this.metrics.sessionStart = performance.now();
    this.metrics.responses = [];
    this.metrics.errors = [];
    this.metrics.connectionEvents = [];
    this.metrics.audioQuality = [];
    this.metrics.conversationFlow = [];
    this.metrics.networkConditions = [];
    
    // Record initial connection
    this.recordConnectionEvent('connected');
  }

  recordResponse(responseData = {}) {
    if (this.metrics.sessionStart) {
      const responseTime = performance.now() - this.metrics.sessionStart;
      const response = {
        timestamp: performance.now(),
        latency: responseTime,
        messageLength: responseData.messageLength || 0,
        audioDuration: responseData.audioDuration || 0,
        ...responseData
      };
      
      this.metrics.responses.push(response);
      
      // Record conversation flow
      this.recordConversationFlow('response_received', response);
    }
  }

  recordConnectionEvent(eventType, details = {}) {
    const event = {
      timestamp: performance.now(),
      type: eventType, // 'connected', 'disconnected', 'reconnecting', 'reconnected'
      details
    };
    
    this.metrics.connectionEvents.push(event);
    
    if (eventType === 'disconnected') {
      this.recordConversationFlow('connection_lost', event);
    } else if (eventType === 'reconnected') {
      this.recordConversationFlow('connection_restored', event);
    }
  }

  recordAudioQuality(rating, issues = []) {
    const audioEvent = {
      timestamp: performance.now(),
      rating, // 1-10 scale
      issues, // Array of issues like ['cutout', 'static', 'volume_drop']
      responseIndex: this.metrics.responses.length
    };
    
    this.metrics.audioQuality.push(audioEvent);
  }

  recordConversationFlow(eventType, data = {}) {
    const flowEvent = {
      timestamp: performance.now(),
      type: eventType,
      data,
      sessionTime: this.metrics.sessionStart ? performance.now() - this.metrics.sessionStart : 0
    };
    
    this.metrics.conversationFlow.push(flowEvent);
  }

  recordNetworkCondition(condition, details = {}) {
    const networkEvent = {
      timestamp: performance.now(),
      condition, // 'excellent', 'good', 'poor', 'very_poor'
      details,  // {speed: '5G', latency: 45, packetLoss: 0.1}
      sessionTime: this.metrics.sessionStart ? performance.now() - this.metrics.sessionStart : 0
    };
    
    this.metrics.networkConditions.push(networkEvent);
  }

  recordError(error, context = {}) {
    const errorEvent = {
      timestamp: performance.now(),
      error: error.message || 'Unknown error',
      code: error.code,
      context,
      sessionTime: this.metrics.sessionStart ? performance.now() - this.metrics.sessionStart : 0
    };
    
    this.metrics.errors.push(errorEvent);
    this.recordConversationFlow('error_occurred', errorEvent);
  }

  // Enhanced latency calculations
  getLatencyMetrics() {
    if (this.metrics.responses.length === 0) return null;
    
    const latencies = this.metrics.responses.map(r => r.latency);
    const sortedLatencies = [...latencies].sort((a, b) => a - b);
    
    return {
      average: latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length,
      median: sortedLatencies[Math.floor(sortedLatencies.length / 2)],
      min: Math.min(...latencies),
      max: Math.max(...latencies),
      p95: sortedLatencies[Math.floor(sortedLatencies.length * 0.95)],
      p99: sortedLatencies[Math.floor(sortedLatencies.length * 0.99)],
      standardDeviation: this.calculateStandardDeviation(latencies),
      consistency: this.calculateLatencyConsistency(latencies)
    };
  }

  // Connection stability metrics
  getConnectionMetrics() {
    if (this.metrics.connectionEvents.length === 0) return null;
    
    const totalSessionTime = this.metrics.sessionStart ? performance.now() - this.metrics.sessionStart : 0;
    const disconnections = this.metrics.connectionEvents.filter(e => e.type === 'disconnected');
    const reconnections = this.metrics.connectionEvents.filter(e => e.type === 'reconnected');
    
    let totalDowntime = 0;
    let reconnectionTimes = [];
    
    // Calculate downtime and reconnection times
    for (let i = 0; i < disconnections.length; i++) {
      const disconnect = disconnections[i];
      const reconnect = reconnections[i];
      
      if (reconnect) {
        const downtime = reconnect.timestamp - disconnect.timestamp;
        totalDowntime += downtime;
        reconnectionTimes.push(downtime);
      }
    }
    
    const uptimePercentage = totalSessionTime > 0 ? (totalSessionTime - totalDowntime) / totalSessionTime : 1;
    
    return {
      uptimePercentage,
      totalDisconnections: disconnections.length,
      totalReconnections: reconnections.length,
      averageReconnectionTime: reconnectionTimes.length > 0 
        ? reconnectionTimes.reduce((sum, time) => sum + time, 0) / reconnectionTimes.length 
        : 0,
      maxReconnectionTime: reconnectionTimes.length > 0 ? Math.max(...reconnectionTimes) : 0,
      totalDowntime,
      connectionStability: this.getConnectionStabilityRating(uptimePercentage)
    };
  }

  // Audio quality metrics
  getAudioQualityMetrics() {
    if (this.metrics.audioQuality.length === 0) return null;
    
    const ratings = this.metrics.audioQuality.map(a => a.rating);
    const issues = this.metrics.audioQuality.flatMap(a => a.issues);
    
    const issueCounts = issues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {});
    
    return {
      averageRating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
      minRating: Math.min(...ratings),
      maxRating: Math.max(...ratings),
      totalIssues: issues.length,
      issueBreakdown: issueCounts,
      clearResponsesPercentage: (ratings.filter(r => r >= 7).length / ratings.length) * 100,
      audioQualityRating: this.getAudioQualityRating(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length)
    };
  }

  // Conversation flow metrics
  getConversationFlowMetrics() {
    if (this.metrics.conversationFlow.length === 0) return null;
    
    const totalExchanges = this.metrics.responses.length;
    const errors = this.metrics.conversationFlow.filter(e => e.type === 'error_occurred');
    const connectionIssues = this.metrics.conversationFlow.filter(e => 
      e.type === 'connection_lost' || e.type === 'connection_restored'
    );
    
    return {
      totalExchanges,
      errorRate: totalExchanges > 0 ? errors.length / totalExchanges : 0,
      connectionIssues: connectionIssues.length,
      averageExchangeTime: totalExchanges > 0 ? this.getLatencyMetrics()?.average : 0,
      conversationHealth: this.getConversationHealthRating(totalExchanges, errors.length, connectionIssues.length)
    };
  }

  // Performance assessment against PRD requirements
  getPRDAssessment() {
    const latencyMetrics = this.getLatencyMetrics();
    const connectionMetrics = this.getConnectionMetrics();
    const audioMetrics = this.getAudioQualityMetrics();
    const flowMetrics = this.getConversationFlowMetrics();
    
    if (!latencyMetrics || !connectionMetrics || !audioMetrics || !flowMetrics) {
      return { status: 'insufficient_data', message: 'Need more conversation data for assessment' };
    }
    
    // PRD Compliance Check
    const latencyCompliant = latencyMetrics.average < this.thresholds.latency.acceptable; // <1.5s
    const connectionCompliant = connectionMetrics.uptimePercentage >= this.thresholds.connection.good; // >=95%
    const audioCompliant = audioMetrics.averageRating >= this.thresholds.audioQuality.acceptable; // >=5
    
    const complianceScore = [latencyCompliant, connectionCompliant, audioCompliant]
      .filter(Boolean).length / 3;
    
    let status, message;
    if (complianceScore === 1) {
      status = 'fully_compliant';
      message = 'All PRD requirements met';
    } else if (complianceScore >= 0.67) {
      status = 'mostly_compliant';
      message = 'Most PRD requirements met, minor issues identified';
    } else if (complianceScore >= 0.33) {
      status = 'partially_compliant';
      message = 'Some PRD requirements met, significant issues identified';
    } else {
      status = 'non_compliant';
      message = 'Major PRD requirements not met';
    }
    
    return {
      status,
      message,
      complianceScore,
      details: {
        latency: {
          compliant: latencyCompliant,
          target: '<1.5s',
          actual: `${Math.round(latencyMetrics.average)}ms`,
          rating: this.getLatencyRating(latencyMetrics.average)
        },
        connection: {
          compliant: connectionCompliant,
          target: '>=95% uptime',
          actual: `${(connectionMetrics.uptimePercentage * 100).toFixed(1)}% uptime`,
          rating: connectionMetrics.connectionStability
        },
        audio: {
          compliant: audioCompliant,
          target: '>=5/10 rating',
          actual: `${audioMetrics.averageRating.toFixed(1)}/10`,
          rating: audioMetrics.audioQualityRating
        }
      }
    };
  }

  // Helper methods for ratings
  getLatencyRating(latency) {
    if (latency < this.thresholds.latency.excellent) return 'Excellent';
    if (latency < this.thresholds.latency.good) return 'Good';
    if (latency < this.thresholds.latency.acceptable) return 'Acceptable';
    return 'Poor';
  }

  getConnectionStabilityRating(uptimePercentage) {
    if (uptimePercentage >= this.thresholds.connection.excellent) return 'Excellent';
    if (uptimePercentage >= this.thresholds.connection.good) return 'Good';
    if (uptimePercentage >= this.thresholds.connection.acceptable) return 'Acceptable';
    return 'Poor';
  }

  getAudioQualityRating(averageRating) {
    if (averageRating >= this.thresholds.audioQuality.excellent) return 'Excellent';
    if (averageRating >= this.thresholds.audioQuality.good) return 'Good';
    if (averageRating >= this.thresholds.audioQuality.acceptable) return 'Acceptable';
    return 'Poor';
  }

  getConversationHealthRating(exchanges, errors, connectionIssues) {
    const errorRate = exchanges > 0 ? errors / exchanges : 0;
    const connectionIssueRate = exchanges > 0 ? connectionIssues / exchanges : 0;
    
    if (errorRate < 0.05 && connectionIssueRate < 0.05) return 'Excellent';
    if (errorRate < 0.1 && connectionIssueRate < 0.1) return 'Good';
    if (errorRate < 0.2 && connectionIssueRate < 0.2) return 'Acceptable';
    return 'Poor';
  }

  // Statistical calculations
  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  calculateLatencyConsistency(latencies) {
    if (latencies.length < 2) return null;
    
    const mean = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const variance = latencies.reduce((sum, lat) => sum + Math.pow(lat - mean, 2), 0) / latencies.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    if (coefficientOfVariation < 0.1) return 'Excellent';
    if (coefficientOfVariation < 0.2) return 'Good';
    if (coefficientOfVariation < 0.3) return 'Acceptable';
    return 'Poor';
  }

  // Enhanced metrics report
  getMetricsReport() {
    const latencyMetrics = this.getLatencyMetrics();
    const connectionMetrics = this.getConnectionMetrics();
    const audioMetrics = this.getAudioQualityMetrics();
    const flowMetrics = this.getConversationFlowMetrics();
    const prdAssessment = this.getPRDAssessment();
    
    return {
      sessionDuration: this.metrics.sessionStart 
        ? performance.now() - this.metrics.sessionStart 
        : 0,
      totalResponses: this.metrics.responses.length,
      totalErrors: this.metrics.errors.length,
      latencyMetrics,
      connectionMetrics,
      audioMetrics,
      flowMetrics,
      prdAssessment,
      performance: this.isPerformanceAcceptable(),
      exportData: this.getExportData()
    };
  }

  // Data export for analysis
  getExportData() {
    return {
      rawResponses: this.metrics.responses,
      rawConnectionEvents: this.metrics.connectionEvents,
      rawAudioQuality: this.metrics.audioQuality,
      rawConversationFlow: this.metrics.conversationFlow,
      rawErrors: this.metrics.errors,
      rawNetworkConditions: this.metrics.networkConditions,
      sessionMetadata: {
        startTime: this.metrics.sessionStart,
        endTime: performance.now(),
        duration: this.metrics.sessionStart ? performance.now() - this.metrics.sessionStart : 0
      }
    };
  }

  // Legacy method for backward compatibility
  getAverageLatency() {
    const latencyMetrics = this.getLatencyMetrics();
    return latencyMetrics ? latencyMetrics.average : null;
  }

  isPerformanceAcceptable() {
    const avgLatency = this.getAverageLatency();
    const errorRate = this.metrics.errors.length / Math.max(this.metrics.responses.length, 1);
    
    return {
      latencyOK: avgLatency ? avgLatency < 1500 : null, // <1.5s requirement
      errorRateOK: errorRate < 0.05, // <5% error rate
      overall: avgLatency && avgLatency < 1500 && errorRate < 0.05
    };
  }
}
