const localDevelopmentOrigin = 'http://localhost:4321';

const normalizeOrigin = (value, source, command) => {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);

    if (command === 'build' && url.protocol !== 'https:') {
      throw new Error('Production metadata requires an HTTPS origin.');
    }

    return url.origin;
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Invalid URL.';
    throw new Error(`${source} must be a valid ${command === 'build' ? 'HTTPS ' : ''}origin. ${reason}`);
  }
};

export const resolveSiteOrigin = (env = process.env, command = 'dev') => {
  const source = env.SITE_URL
    ? ['SITE_URL', env.SITE_URL]
    : env.VERCEL_PROJECT_PRODUCTION_URL
      ? ['VERCEL_PROJECT_PRODUCTION_URL', env.VERCEL_PROJECT_PRODUCTION_URL]
      : env.VERCEL_URL
        ? ['VERCEL_URL', env.VERCEL_URL]
        : undefined;

  if (!source) {
    if (command === 'build') {
      throw new Error('SITE_URL is required for production builds unless Vercel supplies VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL.');
    }

    return localDevelopmentOrigin;
  }

  return normalizeOrigin(source[1], source[0], command);
};
