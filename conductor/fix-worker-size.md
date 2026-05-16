# Implementation Plan: Fix 3MB Cloudflare Worker Limit

## Background & Motivation
The deployment to Cloudflare Workers is failing because the bundled `worker.js` exceeds the 3MB free-tier uncompressed size limit. The primary cause of this bloat is the `googleapis` package used in `src/utils/indexing.ts`. `googleapis` bundles clients for every single Google service, which significantly inflates the server-side Next.js bundle.

## Scope & Impact
- **Target Files:** `src/utils/indexing.ts`, `package.json`, `package-lock.json`.
- **Impact:** The worker size will drop drastically, allowing successful deployments to Cloudflare's free tier. Functionality of the Google Indexing API integration will remain identical.

## Proposed Solution
We will replace the massive `googleapis` dependency with a lightweight, zero-dependency implementation using native `fetch` and the Web Crypto API (native to Cloudflare Workers).

### Implementation Steps
1. **Remove `googleapis`:** 
   - Uninstall `googleapis` from `package.json`.
2. **Refactor `src/utils/indexing.ts`:**
   - Remove `import { google } from 'googleapis'`.
   - Implement a custom `getGoogleAccessToken()` function that:
     - Creates a JWT header and payload.
     - Imports the Google Service Account's private key using `crypto.subtle.importKey`.
     - Signs the JWT using `crypto.subtle.sign` with RS256.
     - Exchanges the signed JWT for a Bearer access token via `fetch` to `https://oauth2.googleapis.com/token`.
   - Update `notifyGoogleOfUpdate()` to use a standard `fetch` call to the Google Indexing REST API (`https://indexing.googleapis.com/v3/urlNotifications:publish`) using the retrieved Bearer token.
3. **Verify:**
   - Run `npm run build` and `npm run deploy` (or `npm run preview`) to ensure the bundle size is well below 3MB and the deploy succeeds.

## Verification
- We will monitor the terminal output during deployment to verify the worker size has been reduced.
- The `drainIndexingQueue` will be tested to ensure the custom `fetch` implementation properly authenticates and pings Google.