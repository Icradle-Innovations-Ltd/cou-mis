# CoU-MIS Prototype

This is a functional prototype for the Church of Uganda MIS demonstrating:
- Member registration and management,
- Sacrament record capture (baptism, confirmation, marriage),
- Financial transaction recording (income and expenses),
- Summary reporting and data validation.

## Setup

1. Open a terminal in this directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to launch the prototype.
4. Open `http://localhost:3000` in your browser.

## Features

- View, add, edit, and delete church members.
- Record sacraments for members, including type, date, location, and officiant.
- Track financial transactions for church units.
- Display live summary metrics for membership and finances.

## Development Notes

- The prototype uses in-memory storage for demonstration purposes unless a PostgreSQL `DATABASE_URL` is configured.
- The API is implemented in `server.js`.
- The frontend is implemented in `public/index.html` and `public/script.js`.
- A production version should connect to PostgreSQL using the schema in `../sql/schema.sql`.

## Railway Deployment

1. Open a terminal in `Coursework/app`.
2. Run `npm install` locally.
3. Add PostgreSQL to your Railway project and copy the `DATABASE_URL` value.
4. Set `DATABASE_URL` in Railway environment variables.
5. Optionally set `DEFAULT_HOUSEHOLD_ID=1` if your database has household seed data.
6. Deploy the app from the `Coursework/app` folder, or use the Railway dashboard to connect the repository and start the service.

## Next Steps

- Add authentication and access control.
- Persist data to PostgreSQL.
- Expand the interface to support diocesan and parish hierarchy management.
- Add report exports for church administration.
