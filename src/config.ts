import * as process from 'process';
const configs = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  GLOBAL: {
    PORT: process.env.PORT || '3000',
  },
  STRIPE_CONFIG: {
    apiKey: 'sk_test_51PE5L8BWs0njoW7wq3HhZnsDbFFQ99yI5kIco4W1PBoCqarYXSLzJq0QrwZAFtiHDrV0dBBiitqYvyDSwAdPKriD00MPaRKhOn',
    webhookConfig: {
      requestBodyProperty: 'rawBody',
      stripeSecrets: {
        account: 'whsec_e7a74c064f399bdd98ddee40b9518daf6e3785a608582600f5bb5a1aaa15001e',
      },
    },
  },
});
export default configs;
