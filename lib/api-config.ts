// Environment configuration for API keys
export const API_CONFIG = {
  OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://deductive-coder.local',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'DeductiveCoder'
}