  // API Configuration
// For local development on physical device or emulator:
// - Android Emulator: use 10.0.2.2
// - iOS Simulator: use localhost
// - Physical Device: use your computer's IP address (e.g., 192.168.1.100)

export const API_CONFIG = {
  // Use your computer's actual IP address for iOS Simulator
  BASE_URL: __DEV__ 
    ? 'http://10.23.1.218:5000/api'  // Your computer's IP
    : 'https://your-production-api.com/api',
  
  TIMEOUT: 10000,
};

// To find your IP address:
// Windows: ipconfig (look for IPv4 Address)
// Mac/Linux: ifconfig or ip addr show
