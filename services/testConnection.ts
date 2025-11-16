// Simple connection test utility
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export const testConnection = async () => {
  console.log('\n🔍 Testing Backend Connection...');
  console.log('BASE_URL:', API_CONFIG.BASE_URL);
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing health endpoint...');
    const healthUrl = API_CONFIG.BASE_URL.replace('/api', '/health');
    const healthResponse = await axios.get(healthUrl, { timeout: 5000 });
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Signup endpoint
    console.log('\n2️⃣ Testing signup endpoint...');
    const signupUrl = `${API_CONFIG.BASE_URL}/auth/signup`;
    console.log('Full URL:', signupUrl);
    
    const testData = {
      name: 'Connection Test',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123'
    };
    
    const signupResponse = await axios.post(signupUrl, testData, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Signup test passed:', signupResponse.status);
    console.log('Response:', signupResponse.data);
    
    return { success: true, message: 'All tests passed!' };
  } catch (error: any) {
    console.error('❌ Connection test failed:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.response?.data
    };
  }
};
