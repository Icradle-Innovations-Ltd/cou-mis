# Railway Deployment Guide

This guide explains how to deploy the CoU-MIS prototype UI and PostgreSQL database on Railway.

## 1. Prepare the app

- The app is located in `Coursework/app`.
- It uses `server.js` and the static frontend in `public/`.
- A Dockerfile is included for Railway deployment.

## 2. Set up Railway

1. Create a new Railway project.
2. Add a PostgreSQL plugin to the project.
3. Copy the generated `DATABASE_URL`.
4. In Railway variables, add:
   - `DATABASE_URL` with the plugin connection string
   - `DEFAULT_HOUSEHOLD_ID=1` (optional)

## 3. Deploy the app

### Option A: Deploy using Railway dashboard

- Connect the repository to Railway.
- Set the root path for the service to `Coursework/app`.
- Add the environment variables from step 2.
- Use the default start command: `npm start`.

### Option B: Deploy using Railway CLI

```bash
cd "Coursework/app"
npm install
railway up
```

## 4. Hosted URLs

- Public Railway host: `https://cou-mis-production.up.railway.app`
- Custom domain (pending DNS update / plan limit): `https://cou.divinefishers.com`

## 5. Database notes

- Use `Coursework/sql/schema.sql` to initialize the PostgreSQL database.
- Railway's PostgreSQL plugin can run the SQL manually or import via a migration tool.
- The app uses `member`, `sacrament`, and `transaction_record` tables when `DATABASE_URL` is configured.

## 5. Health check

- The app exposes `/api/health` to verify it is running.
- Static frontend is served from `/`.
