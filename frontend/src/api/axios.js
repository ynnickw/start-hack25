import axios from 'axios';
import { createAwsAuthInterceptor } from '../interceptors/awsAuthInterceptor';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

// Configure AWS credentials
const credentials = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
};

// Validate credentials
if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  console.error('AWS credentials are missing!');
}

// Debug: Log credentials (nur für Entwicklung)
console.log('Using AWS credentials:', {
  accessKeyId: credentials.accessKeyId?.slice(0,4) + '...',
  hasSecret: !!credentials.secretAccessKey,
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Add the interceptor
api.interceptors.request.use(createAwsAuthInterceptor(credentials));

export default api; 