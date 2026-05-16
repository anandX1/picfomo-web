/**
 * PICFOMO CACHE INFRASTRUCTURE
 * Staff+ Implementation for High-Scale Edge Caching
 */

export const CACHE_TAGS = {
  styles: 'styles',
  posts: 'posts',
  users: 'users',
  useCases: 'use-cases',
  comparisons: 'comparisons',
  glossary: 'glossary',
} as const;

export const REVALIDATE_TIMERS = {
  homepage: 60,         // 1 minute
  explore: 60,          // 1 minute
  style: 300,           // 5 minutes
  useCase: 3600,        // 1 hour
  compare: 3600,        // 1 hour
  glossary: 86400,      // 24 hours
  post: 86400,          // 24 hours
} as const;
