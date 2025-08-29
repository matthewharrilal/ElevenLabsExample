import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RecordingControls({ 
  onStartRecording, 
  onStopRecording, 
  isRecording, 
  audioLevel 
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recording]}
        onPress={isRecording ? onStopRecording : onStartRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.levelContainer}>
        <View 
          style={[styles.levelBar, { width: `${audioLevel * 100}%` }]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15
  },
  recording: { backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  levelContainer: {
    width: 200,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden'
  },
  levelBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.1s'
  }
});
