export function getEnvPath(): string {
  const env = process.env.NODE_ENV;

  if (!env || env === 'production') {
    return '.env';
  }

  return `.${env}.env`;
}
