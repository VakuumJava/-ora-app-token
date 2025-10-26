# Security Guidelines

## Environment Variables

### Client-Side Variables (Safe to expose)
All environment variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript and are publicly accessible. Only use this prefix for non-sensitive data:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key (safe, has RLS protection)
- ✅ `NEXT_PUBLIC_API_URL` - Public API endpoint
- ✅ `NEXT_PUBLIC_MAPBOX_TOKEN` - Public Mapbox token (restricted by domain)

### Server-Side Variables (Keep secret)
These variables are NEVER exposed to the client and should only be used in:
- Server Components
- Server Actions
- API Routes
- Middleware

- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Full database access (NEVER use in client code)
- ❌ `SUPABASE_JWT_SECRET` - Used for token verification
- ❌ Any API keys with write/admin permissions

## Row Level Security (RLS)

All database tables MUST have RLS policies enabled. The `SUPABASE_ANON_KEY` is safe to expose because:
1. It can only access data allowed by RLS policies
2. Users can only see/modify their own data
3. All sensitive operations require authentication

## Git Security

- `.env*` files are in `.gitignore` and should NEVER be committed
- Use Vercel environment variables for production
- Rotate keys immediately if accidentally committed

## Current Setup

✅ All client-side code uses only `NEXT_PUBLIC_` prefixed variables
✅ Sensitive keys are only used server-side
✅ `.env` files are properly ignored
✅ Database has RLS policies enabled
