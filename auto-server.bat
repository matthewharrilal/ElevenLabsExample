@echo off
echo 🚀 Auto Server Manager for Windows Starting...

:kill_instances
echo 🔪 Killing all existing instances...
taskkill /f /im node.exe 2>nul
taskkill /f /im expo.exe 2>nul
taskkill /f /im metro.exe 2>nul

echo ✅ All instances killed
timeout /t 2 /nobreak >nul

:start_server
echo 🚀 Starting Expo server...
npx expo start --clear

echo ✅ Server started successfully
goto :eof
