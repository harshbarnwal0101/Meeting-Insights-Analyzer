# Meeting Insights Analyzer

A Next.js 14 (App Router) application that analyzes meeting transcripts with AI (Google Gemini) and visualizes insights. Users can authenticate, create meetings, upload/paste transcripts, and view analytics per meeting.

## Tech Stack
- Next.js 14 (App Router) + React + TypeScript
- NextAuth for authentication (Credentials provider)
- MongoDB + Mongoose for persistence
- Google Gemini API for analysis
- recharts for data visualization
- Tailwind-like utility classes (via global styles) for styling

## Features
- **Authentication**: Sign up / Sign in powered by NextAuth (credentials).
- **Meetings**: Create meetings by name (client), list recent meetings.
- **Transcripts**: Paste or upload transcript files; the app analyzes them with Gemini and stores scores.
- **Analytics**: Dedicated page per meeting with score cards, radar chart (current vs avg last 3), overall trend, and grouped bar chart across properties.
- **Clean UI**: Light theme, sidebar app shell, tidy tables and dialogs.

## Project Structure
```
app/
  (auth)/
    login/page.tsx         # Sign in
    signup/page.tsx        # Sign up
  api/
    auth/[...nextauth]/route.ts  # NextAuth handlers
    auth/signup/route.ts         # Signup API (credentials)
    meetings/route.ts            # GET recent meetings for user
    transcripts/route.ts         # POST analyze, GET list transcripts+scores by meetingId
  dashboard/page.tsx       # Recent meetings table + New Meeting dialog
  meetings/[id]/page.tsx   # Analytics page for a single meeting
components/
  AppShell.tsx             # Sidebar + header layout
  NewMeetingDialog.tsx     # Create meeting + paste/upload transcript and analyze
  MeetingList.tsx          # (optional) list component
  ScoreCard.tsx            # KPI card for a score
  TranscriptList.tsx       # List of transcripts
lib/
  gemini.ts                # Gemini REST helper (with version/model fallback)
  mongoose.ts              # Mongo connection
  rbac.ts                  # checkAuthorization helper using NextAuth session
models/
  User.ts, Meeting.ts, Transcript.ts, Score.ts, Organization.ts
styles/
  globals.css
```

## Prerequisites
- Node.js 18+ (Node 20 recommended)
- A MongoDB Atlas cluster (or local MongoDB)
- A Google Gemini API key

## Environment Variables
Create `./.env.local` at the project root. Example:

```
# MongoDB: include database name; URL-encode special chars in password. Wrap in quotes if it contains &, %, etc.
MONGODB_URI="mongodb+srv://<USERNAME>:<PASSWORD_ENCODED>@<CLUSTER>.mongodb.net/meeting-analyzer?retryWrites=true&w=majority&appName=<APPNAME>"

# NextAuth
NEXTAUTH_SECRET=<base64_random_string>
NEXTAUTH_URL=http://localhost:3000

# Gemini
GEMINI_API_KEY=<your_gemini_api_key>
# Optional: choose a model you have access to
GEMINI_MODEL=gemini-1.5-flash-latest
```

Tips:
- URL-encoding examples: `@` → `%40`, `#` → `%23`, `!` → `%21`, `$` → `%24`, `&` → `%26`, space → `%20`.
- If you see `MongoAPIError: URI must include hostname...` or `bad auth`, quote the URI, include a database name (e.g. `meeting-analyzer`), and verify user credentials in Atlas.

## Install & Run
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Authentication
- Credentials provider (email + password)
- Sign up: `POST /api/auth/signup` then login on `/login`
- After login you’re redirected to `/dashboard`

## Core Flows
- **Dashboard (`/dashboard`)**
  - Shows a table of recent meetings.
  - Click “New Meeting” to open a dialog:
    - Enter client/meeting name
    - Paste transcript or upload `.txt/.md/.rtf/.log/.json`
    - Click Analyze — the app calls `POST /api/transcripts` to analyze, create/fetch the meeting, store transcript + scores, then redirects to `/meetings/[id]`.

- **Analytics (`/meetings/[id]`)**
  - Latest KPI score cards
  - Radar: current vs average (last 3 entries)
  - Overall trend line chart
  - Grouped bar: last up to 5 entries across properties

## API Endpoints
- `GET /api/meetings?name=<optional>&limit=<optional>`
  - Returns `{ meetings: Meeting[] }` for current user, newest first.
- `POST /api/transcripts` with JSON body:
  - `{ meetingId?: string; meetingName?: string; text: string }`
  - Analyzes with Gemini, creates transcript + score, returns `{ transcript, score }`.
- `GET /api/transcripts?meetingId=<id>&limit=5`
  - Returns `{ items: [{ transcript, score }, ...] }` newest-first.

## Gemini Configuration
- `lib/gemini.ts` calls the REST API. It tries `v1beta`, and if 404, retries `v1beta2`.
- Default model is `gemini-1.5-flash-latest`. You can override with `GEMINI_MODEL`.
- If Gemini fails or key is missing, a fallback result is returned so the UI doesn’t break.

## Type Safety
- We use NextAuth module augmentation in `types/next-auth.d.ts` to add `id`, `role`, and `orgId` to `Session`/`JWT`.
- `lib/rbac.ts` returns `{ session }` to routes to enforce roles and auth.

## Troubleshooting
- **Invalid <Link> with <a> child**: Use `<Link href="/" className="...">Text</Link>` in App Router. Don’t nest `<a>`.
- **Mongo URI errors**:
  - Quote the URI in `.env.local` and ensure special characters are URL-encoded.
  - Add a database name in the path, e.g., `/meeting-analyzer`.
  - Verify Atlas user credentials and IP allowlist (Network Access). Consider a simple alphanumeric password to rule out encoding issues.
- **NextAuth types**: Ensure `authOptions` is typed as `AuthOptions` and that `session.strategy` is `'jwt'`.
- **Gemini 404**: Set `GEMINI_MODEL` to a model your key can access (e.g., `gemini-1.5-flash-latest`, `gemini-1.5-pro-latest`, or `gemini-pro`).

## Scripts
- `npm run dev` — start Next.js in development
- `npm run build` — build for production
- `npm start` — run the built app

## Security Notes
- Do not commit `.env.local`.
- Rotate keys if they were shared publicly.

## Roadmap / Ideas
- Per-client aggregated analytics view and filters
- Transcript preview table on analytics page
- Export CSV/JSON of scores
- Delete meetings/transcripts

## Demo Walkthrough
Below is a quick walkthrough of the main flows. You can capture your own screenshots and place them under `public/demo/` (these paths are just examples). If the images don’t render, make sure the files exist at the referenced paths or update the links accordingly.

1) Sign In page
- Path: `/login`
- Clean card UI with tabs for Sign In / Sign Up.

![Sign In](public/demo/01-login.png)

2) Sign Up page
- Path: `/signup`
- Create your account with name, organization, email, and password.

![Sign Up](public/demo/02-signup.png)

3) Dashboard (Recent Meetings)
- Path: `/dashboard`
- Sidebar on the left, header actions on top.
- Table of recent meetings. Click a row to open analytics.

![Dashboard](public/demo/03-dashboard.png)

4) New Meeting dialog
- Click “New Meeting” on the dashboard.
- Enter client/meeting name, paste or upload a transcript, click Analyze.

![New Meeting Dialog](public/demo/04-new-meeting-dialog.png)

5) Meeting Analytics page
- Path: `/meetings/[id]`
- KPI cards for the latest analysis.
- Radar (current vs avg last 3), overall trend line, and grouped property bars.

![Meeting Analytics](public/demo/05-meeting-analytics.png)

How to add screenshots
- Take screenshots in your browser, save them as PNGs under `public/demo/`.
- Update the Markdown image paths above if you use different filenames.
- On Next.js, anything in `public/` is served statically from the site root (e.g., `public/demo/01.png` is available at `/demo/01.png`).
