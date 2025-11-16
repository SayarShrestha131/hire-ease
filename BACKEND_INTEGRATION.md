# Backend Integration Guide

## Setup Steps

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Configure API URL for Mobile App

Update `my-expo-app/config/api.config.ts` based on your testing environment:

#### For Android Emulator:
```typescript
BASE_URL: 'http://10.0.2.2:5000/api'
```

#### For iOS Simulator:
```typescript
BASE_URL: 'http://localhost:5000/api'
```

#### For Physical Device:
1. Find your computer's IP address:
   - Windows: Run `ipconfig` in CMD (look for IPv4 Address)
   - Mac: Run `ifconfig` in Terminal (look for inet under en0)
   - Linux: Run `ip addr show`

2. Update the URL:
```typescript
BASE_URL: 'http://YOUR_IP_ADDRESS:5000/api'
// Example: 'http://192.168.1.100:5000/api'
```

3. Make sure your phone and computer are on the same WiFi network

### 3. Update Backend CORS Settings

In `backend/src/index.ts`, update the CORS origin to allow your mobile app:

```typescript
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
}));
```

### 4. Test the Integration

1. Start the backend: `cd backend && npm run dev`
2. Start the mobile app: `cd my-expo-app && npm start`
3. Try signing up with a new account
4. Try logging in
5. The tokens will be automatically stored and managed

## API Integration Features

### ✅ Implemented

- **Signup**: Creates new user account with JWT tokens
- **Login**: Authenticates user and returns tokens
- **Auto Token Storage**: Tokens saved to AsyncStorage
- **Auto Token Refresh**: Expired access tokens automatically refreshed
- **Logout**: Clears tokens from storage and server
- **Error Handling**: User-friendly error messages

### 🔄 Token Management

The app automatically:
- Stores access and refresh tokens securely
- Adds access token to all API requests
- Refreshes expired access tokens using refresh token
- Clears tokens on logout

### 📱 Updated Screens

- **LoginScreen**: Now calls real API for authentication
- **RegisterScreen**: Now calls real API for user creation
- **ForgotPasswordScreen**: Ready for API integration (backend endpoint exists)

## Troubleshooting

### "Network Error" or "Connection Refused"

1. Make sure backend server is running
2. Check the API URL in `config/api.config.ts`
3. For physical devices, ensure same WiFi network
4. Try disabling firewall temporarily

### "CORS Error"

Update backend CORS settings to allow your origin

### "401 Unauthorized"

Token might be expired or invalid. Try logging out and logging in again.

## Next Steps

1. Implement change password screen
2. Add user profile screen
3. Add loading states and better error handling
4. Implement forgot password flow with email
5. Add form validation feedback
