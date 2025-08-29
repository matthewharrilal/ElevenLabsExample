export class ConversationPerformanceMonitor {
  constructor() {
    this.metrics = {
      sessionStart: null,
      responses: [],
      errors: []
    };
  }

  recordSessionStart() {
    this.metrics.sessionStart = performance.now();
    this.metrics.responses = [];
    this.metrics.errors = [];
  }

  recordResponse() {
    if (this.metrics.sessionStart) {
      const responseTime = performance.now() - this.metrics.sessionStart;
      this.metrics.responses.push({
        timestamp: performance.now(),
        latency: responseTime
      });
    }
  }

  recordError(error) {
    this.metrics.errors.push({
      timestamp: performance.now(),
      error: error.message || 'Unknown error',
      code: error.code
    });
  }

  getAverageLatency() {
    if (this.metrics.responses.length === 0) return null;
    
    const totalLatency = this.metrics.responses.reduce(
      (sum, response) => sum + response.latency, 
      0
    );
    return totalLatency / this.metrics.responses.length;
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

  getMetricsReport() {
    return {
      sessionDuration: this.metrics.sessionStart 
        ? performance.now() - this.metrics.sessionStart 
        : 0,
      totalResponses: this.metrics.responses.length,
      averageLatency: this.getAverageLatency(),
      errorCount: this.metrics.errors.length,
      performance: this.isPerformanceAcceptable()
    };
  }
}
