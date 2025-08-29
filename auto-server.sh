#!/bin/bash

# Auto Server Manager for ElevenLabs Example
# This script kills all instances and keeps the server running

echo "🚀 Auto Server Manager Starting..."

# Function to kill all Expo and Node processes
kill_all_instances() {
    echo "🔪 Killing all existing instances..."
    
    # Kill all Expo processes
    pkill -f "expo" 2>/dev/null || true
    pkill -f "metro" 2>/dev/null || true
    
    # Kill all Node processes (be careful with this in production)
    pkill -f "node.*expo" 2>/dev/null || true
    
    # Kill processes on common Expo ports
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true  # Metro bundler
    lsof -ti:19000 | xargs kill -9 2>/dev/null || true  # Expo CLI
    lsof -ti:19001 | xargs kill -9 2>/dev/null || true  # Expo DevTools
    lsof -ti:19002 | xargs kill -9 2>/dev/null || true  # Expo tunnel
    
    echo "✅ All instances killed"
}

# Function to start the server
start_server() {
    echo "🚀 Starting Expo server..."
    
    # Clear any cached files
    npx expo start --clear
    
    echo "✅ Server started successfully"
}

# Function to monitor and restart if needed
monitor_server() {
    echo "👀 Monitoring server health..."
    
    while true; do
        # Check if Expo is running
        if ! pgrep -f "expo" > /dev/null; then
            echo "⚠️  Server stopped, restarting..."
            start_server
        fi
        
        # Wait 10 seconds before next check
        sleep 10
    done
}

# Main execution
main() {
    # Kill all existing instances
    kill_all_instances
    
    # Wait a moment for processes to fully terminate
    sleep 2
    
    # Start the server
    start_server
    
    # Start monitoring in background
    monitor_server &
    
    echo "🎉 Auto Server Manager is running!"
    echo "Press Ctrl+C to stop"
    
    # Wait for user interrupt
    wait
}

# Handle script interruption
trap 'echo "🛑 Shutting down..."; pkill -f "expo"; exit 0' INT TERM

# Run main function
main
