import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-browser';

const region = 'us-east-1';
const service = 'execute-api';

export const createAwsAuthInterceptor = (credentials) => {
  // Validate credentials
  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    throw new Error('AWS credentials are missing');
  }

  const signer = new SignatureV4({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    region: region,
    service: service,
    sha256: Sha256,
    applyChecksum: true,  // Important for API Gateway
  });

  return async (config) => {
    const fullUrl = new URL(config.url, config.baseURL || process.env.REACT_APP_BACKEND_URL);
    
    const body = config.data ? JSON.stringify(config.data) : undefined;
    const datetime = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    
    try {
      const signedRequest = await signer.sign({
        method: config.method.toUpperCase(),
        hostname: fullUrl.hostname,
        path: fullUrl.pathname + fullUrl.search,
        protocol: fullUrl.protocol,
        headers: {
          'Content-Type': 'application/json',
          'X-Amz-Date': datetime,
          host: fullUrl.hostname,  // Required for signing
        },
        body,
      });

      // Apply headers
      config.headers = {
        'Content-Type': 'application/json',
        'X-Amz-Date': datetime,
        'X-Amz-Content-Sha256': signedRequest.headers['x-amz-content-sha256'],
        'Authorization': signedRequest.headers.authorization || signedRequest.headers.Authorization,
      };

      return config;
    } catch (error) {
      throw error;
    }
  };
}; 