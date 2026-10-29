# OpsLens Assist

OpsLens Assist is a MERN incident investigation workspace. It stores incidents in MongoDB, applies ownership-aware authentication, and turns incident context into AI diagnostic hypotheses that operators must verify against production evidence.

> AI suggestions must be verified against logs, metrics, and system evidence before any production change.

## What is included

- HttpOnly-cookie JWT signup, login, logout, session lookup, password hashing, and protected routes.
- Incident creation, ownership isolation, search, pagination, filters, status changes, deletion, and an incident register.
- Dedicated Gemini service with structured JSON validation, timeout handling, safe failure persistence, retry support, and persisted incident chat.
- Live dashboard, incident detail investigation view, chat, analytics aggregations, theme switcher, responsive navigation, and empty/loading/error states.
- Backend health endpoint at both `/health` and `/api/health`.

## Stack and structure

The frontend is React/Vite with React Router, Axios, Lucide, Recharts-ready analytics views, and CSS variable tokens. The API is Express, Mongoose, MongoDB, JWT, bcryptjs, Zod, Helmet, CORS, rate limiting, and the official Gemini SDK.

- `client/src`: routes, pages, API client, auth context, shell, and styles.
- `server/src`: config, middleware, models, controllers, routes, validators, and AI service.
- `server/tests`: API tests.

## Prerequisites

Node.js 20+, npm, and a MongoDB instance. MongoDB Atlas works as well as a local server. A Gemini API key is required only for AI analysis and chat.

## Run locally

```bash
npm install
npm --prefix server install
npm --prefix client install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

### Environment

Server variables are in `server/.env.example`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_URL`, and `NODE_ENV`. Client code only receives `VITE_API_BASE_URL`; secrets must never use the `VITE_` prefix.

Add the Atlas connection string and allow the development machine IP in Atlas Network Access. Generate a long random JWT secret. Create a Gemini key in Google AI Studio and set `GEMINI_API_KEY`. Without that key, incident creation still persists and analysis returns a clear retryable configuration error.

## API summary

All incident, analysis, chat, and analytics routes require the `opslens_token` HttpOnly cookie.

- `POST /api/auth/signup` body `{name,email,password,confirmPassword}`
- `POST /api/auth/login` body `{email,password,remember}`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/incidents?page=1&limit=10&search=payment&severity=High`
- `POST /api/incidents` body `{title,description,service,severity,environment}`
- `GET /api/incidents/:id`, `PATCH /api/incidents/:id`, `DELETE /api/incidents/:id`
- `POST /api/incidents/:id/analyze`
- `GET /api/incidents/:id/messages`
- `POST /api/ask` body `{incidentId,message}`
- `GET /api/analytics`

Responses use `{success:true,...}` or `{success:false,error:{code,message,details?}}`. Incident documents use camelCase in MongoDB and expose `id` plus `created_at` aliases in JSON. The UI primarily uses the native `createdAt` value as well.

## AI behavior

The AI receives title, description, service, severity, environment, and recent chat context as delimited untrusted data. The service requests JSON, strips code fences, validates the response with Zod, and stores analysis status as `Pending`, `Analyzing`, `Completed`, or `Failed`. AI content is never treated as proof and does not claim a fix was applied.

## Testing and builds

```bash
npm test
npm run build
npm --prefix client run lint
```

The current backend test covers the unauthenticated degraded health contract. The production build has been run successfully. Full Mongo-backed auth, ownership, aggregation, AI mocking, and browser component coverage should be expanded before a production release; those tests require a reachable MongoDB or a working `mongodb-memory-server` binary cache.

## Troubleshooting

- `503` health: MongoDB is not connected or the URI/IP allowlist is wrong.
- CORS errors: set `CLIENT_URL` to the exact client origin and keep credentials enabled.
- Session errors: use a fresh browser session after changing JWT settings; cookies are HttpOnly.
- AI unavailable: check the Gemini key/model, quota, and rate limits. The saved incident remains available for retry.

## Deployment

Deploy the API to Render, Railway, or a comparable Node host and the client to Vercel/Netlify. Set production `CLIENT_URL` exactly, use HTTPS so secure cookies are enabled, provide a strong JWT secret, configure the Atlas allowlist, and never expose server env values through Vite.

## Known limitations

Profile editing, password rotation, notifications derived from activity, and step-completion persistence are not yet implemented as separate APIs. The existing settings screen states this explicitly rather than presenting non-functional controls.
