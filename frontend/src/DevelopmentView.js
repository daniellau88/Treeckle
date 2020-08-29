const env = process.env.NODE_ENV || 'development';

// toggle this to switch between production and development
export const DEVELOPMENT_VIEW = env == 'development';
// toggle this to enable/disable console logging
export const CONSOLE_LOGGING = env == 'development';
