# Sample Performance Data Export

This document shows the structure and format of the performance data exported by the enhanced measurement framework. Use this as a reference for analyzing your test results.

## Data Export Structure

When you click "Export Performance Data", the system generates a JSON file containing comprehensive metrics from your conversation session.

## Sample Export Data

```json
{
  "sessionMetadata": {
    "startTime": 1703123456789,
    "endTime": 1703123789123,
    "duration": 332334
  },
  "rawResponses": [
    {
      "timestamp": 1703123457123,
      "latency": 847,
      "messageLength": 45,
      "audioDuration": 3200,
      "messageType": "ai_response"
    },
    {
      "timestamp": 1703123461234,
      "latency": 1234,
      "messageLength": 67,
      "audioDuration": 4500,
      "messageType": "ai_response"
    },
    {
      "timestamp": 1703123467890,
      "latency": 956,
      "messageLength": 23,
      "audioDuration": 1800,
      "messageType": "ai_response"
    }
  ],
  "rawConnectionEvents": [
    {
      "timestamp": 1703123456789,
      "type": "connected",
      "details": {}
    },
    {
      "timestamp": 1703123465000,
      "type": "disconnected",
      "details": {
        "reason": "network_timeout"
      }
    },
    {
      "timestamp": 1703123468000,
      "type": "reconnected",
      "details": {
        "reconnectionAttempt": 1
      }
    }
  ],
  "rawAudioQuality": [
    {
      "timestamp": 1703123458000,
      "rating": 9,
      "issues": [],
      "responseIndex": 1
    },
    {
      "timestamp": 1703123462000,
      "rating": 7,
      "issues": ["slight_delay"],
      "responseIndex": 2
    },
    {
      "timestamp": 1703123469000,
      "rating": 8,
      "issues": [],
      "responseIndex": 3
    }
  ],
  "rawConversationFlow": [
    {
      "timestamp": 1703123456789,
      "type": "session_started",
      "data": {},
      "sessionTime": 0
    },
    {
      "timestamp": 1703123457123,
      "type": "response_received",
      "data": {
        "latency": 847,
        "messageLength": 45
      },
      "sessionTime": 334
    },
    {
      "timestamp": 1703123465000,
      "type": "connection_lost",
      "data": {
        "type": "disconnected",
        "reason": "network_timeout"
      },
      "sessionTime": 82311
    },
    {
      "timestamp": 1703123468000,
      "type": "connection_restored",
      "data": {
        "type": "reconnected",
        "reconnectionAttempt": 1
      },
      "sessionTime": 112311
    }
  ],
  "rawErrors": [
    {
      "timestamp": 1703123465000,
      "error": "WebSocket connection lost",
      "code": "NETWORK_ERROR",
      "context": {
        "context": "conversation_error",
        "conversationStatus": "disconnected"
      },
      "sessionTime": 82311
    }
  ],
  "rawNetworkConditions": [
    {
      "timestamp": 1703123456789,
      "condition": "excellent",
      "details": {
        "speed": "5G/WiFi",
        "estimatedLatency": 20
      },
      "sessionTime": 0
    },
    {
      "timestamp": 1703123460000,
      "condition": "poor",
      "details": {
        "speed": "3G",
        "estimatedLatency": 150
      },
      "sessionTime": 32311
    }
  ]
}
```

## Data Analysis Examples

### 1. Response Time Analysis

```javascript
// Calculate average response time
const responseTimes = rawResponses.map(r => r.latency);
const averageLatency = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

// Find fastest and slowest responses
const fastestResponse = Math.min(...responseTimes);
const slowestResponse = Math.max(...responseTimes);

// Calculate consistency (standard deviation)
const mean = averageLatency;
const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / responseTimes.length;
const standardDeviation = Math.sqrt(variance);
```

### 2. Connection Stability Analysis

```javascript
// Calculate uptime percentage
const totalSessionTime = sessionMetadata.duration;
const disconnections = rawConnectionEvents.filter(e => e.type === 'disconnected');
const reconnections = rawConnectionEvents.filter(e => e.type === 'reconnected');

let totalDowntime = 0;
for (let i = 0; i < disconnections.length; i++) {
  const disconnect = disconnections[i];
  const reconnect = reconnections[i];
  
  if (reconnect) {
    const downtime = reconnect.timestamp - disconnect.timestamp;
    totalDowntime += downtime;
  }
}

const uptimePercentage = (totalSessionTime - totalDowntime) / totalSessionTime;
```

### 3. Audio Quality Analysis

```javascript
// Calculate average audio quality
const ratings = rawAudioQuality.map(a => a.rating);
const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

// Count issues by type
const allIssues = rawAudioQuality.flatMap(a => a.issues);
const issueCounts = allIssues.reduce((acc, issue) => {
  acc[issue] = (acc[issue] || 0) + 1;
  return acc;
}, {});

// Calculate clear responses percentage
const clearResponses = ratings.filter(r => r >= 7).length;
const clearPercentage = (clearResponses / ratings.length) * 100;
```

### 4. Performance Trend Analysis

```javascript
// Group responses by time intervals
const timeIntervals = {};
rawResponses.forEach(response => {
  const interval = Math.floor(response.sessionTime / 60000); // 1-minute intervals
  if (!timeIntervals[interval]) timeIntervals[interval] = [];
  timeIntervals[interval].push(response.latency);
});

// Calculate average latency per interval
const intervalAverages = {};
Object.keys(timeIntervals).forEach(interval => {
  const latencies = timeIntervals[interval];
  intervalAverages[interval] = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
});
```

## Key Metrics to Track

### Latency Performance
- **Average Response Time**: Overall system responsiveness
- **95th Percentile**: Worst-case performance for 95% of users
- **Standard Deviation**: Consistency of performance
- **Trend Analysis**: Performance over time

### Connection Reliability
- **Uptime Percentage**: System availability
- **Disconnection Frequency**: How often connections drop
- **Reconnection Speed**: Recovery time from failures
- **Network Impact**: Performance under different conditions

### Audio Quality
- **Average Rating**: Overall user satisfaction
- **Issue Frequency**: Common problems encountered
- **Quality Trends**: Changes over time
- **Platform Differences**: iOS vs Web performance

### Error Analysis
- **Error Types**: Categories of failures
- **Error Frequency**: How often problems occur
- **Recovery Patterns**: How system handles failures
- **Context Correlation**: What conditions cause errors

## Data Export Best Practices

### Export After Each Session
- Capture fresh data immediately
- Avoid data loss from app restarts
- Maintain complete testing records

### Organize by Test Type
- Create separate files for different test scenarios
- Use descriptive filenames with dates
- Group related test sessions together

### Regular Analysis
- Weekly review of performance trends
- Monthly comprehensive analysis
- Quarterly client reporting

### Data Backup
- Store exports in multiple locations
- Version control for important datasets
- Regular backup of testing history

## Using Data for Client Presentations

### Executive Summary
- **Overall Performance**: Excellent/Good/Acceptable/Needs Work
- **Key Metrics**: Response time, reliability, quality
- **Trends**: Performance over time
- **Recommendations**: Next steps for improvement

### Technical Details
- **Performance Breakdown**: Individual metric analysis
- **Comparison Data**: Before/after improvements
- **Benchmarking**: Industry standard comparisons
- **Root Cause Analysis**: Why issues occur

### Actionable Insights
- **Immediate Fixes**: Quick wins for performance
- **Short-term Goals**: 1-2 month improvements
- **Long-term Strategy**: 3-6 month roadmap
- **Resource Planning**: What's needed for success

This data structure provides comprehensive insights into your ElevenLabs integration performance, enabling data-driven decisions and clear client communication.
