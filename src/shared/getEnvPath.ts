export const getEnvPath = () => {
  const env = process.env.NODE_ENV;
  return !env || env === 'production' ? '.env' : `.env.${env}`;
};
