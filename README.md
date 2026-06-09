# E-Cell News Tracker

Comprehensive monthly startup and entrepreneurship news tracker for IIM Bangalore students.

## Features

- Multi-source daily news aggregation (Entrackr, Economic Times, Inc42, startup API)
- Categorization: Funding, Startups, Events, Jobs, Markets, Policy
- Search and filter dashboard (React)
- Monthly report generation with category/source analytics
- Monthly digest email support (Nodemailer)
- MongoDB persistence for news, preferences, and subscriptions
- Docker + docker-compose deployment support

## Project Structure

```text
ecell-news-tracker/
├── backend/
│   ├── src/
│   │   ├── scrapers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run start
```

Backend runs on `http://localhost:4000`.

### Key Endpoints

- `GET /api/health`
- `GET /api/news`
- `POST /api/news/fetch`
- `GET /api/news/reports/monthly?month=YYYY-MM`
- `GET /api/news/analytics/summary`
- `POST /api/subscriptions`

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Cron Jobs

Configured in backend:

- `DAILY_FETCH_CRON` (default: `0 8 * * *`) for daily news ingestion
- `MONTHLY_DIGEST_CRON` (default: `0 9 1 * *`) for monthly report email

Monthly digests are sent to `DIGEST_EMAIL` (default: `rg19200109@gmail.com`).

## Docker Deployment

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- MongoDB: `mongodb://localhost:27017`

## Production Notes

- Use a managed MongoDB instance in production.
- Configure valid SMTP credentials to enable email digests.
- For cloud deployment (Vercel/Heroku/AWS), set environment variables from `.env.example`.
