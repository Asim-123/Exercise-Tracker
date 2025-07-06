# Exercise Tracker

A full-stack JavaScript application for tracking exercise logs, built with Node.js, Express, MongoDB, and deployed on Netlify.

## Features

- Create and manage users
- Add exercise entries with description, duration, and date
- View exercise logs with filtering options (date range, limit)
- RESTful API endpoints
- Modern web interface

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users

### Exercises
- `POST /api/users/:_id/exercises` - Add exercise to user
- `GET /api/users/:_id/logs` - Get user's exercise log

### Query Parameters for Logs
- `from` - Start date (yyyy-mm-dd)
- `to` - End date (yyyy-mm-dd)
- `limit` - Number of exercises to return

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Exercise-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## Netlify Deployment

### Prerequisites
- Netlify account
- MongoDB Atlas (or other cloud MongoDB service)

### Deployment Steps

1. **Push your code to GitHub**

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: Leave empty (not needed for serverless)
   - Publish directory: `public`

4. **Environment Variables**
   In Netlify dashboard, go to Site settings > Environment variables:
   - `MONGO_URI`: Your MongoDB connection string

5. **Deploy**
   - Netlify will automatically deploy your site
   - Your API will be available at `https://your-site.netlify.app/.netlify/functions/api`

## Project Structure

```
Exercise-Tracker/
├── models/
│   ├── User.js          # User model
│   └── Exercise.js      # Exercise model
├── routes/
│   └── api.js           # API routes
├── netlify/
│   └── functions/
│       └── api.js       # Serverless function
├── public/
│   └── index.html       # Frontend
├── server.js            # Express server (local dev)
├── netlify.toml         # Netlify configuration
├── package.json
└── README.md
```

## Testing the API

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

### Add Exercise
```bash
curl -X POST http://localhost:3000/api/users/USER_ID/exercises \
  -H "Content-Type: application/json" \
  -d '{"description": "Running", "duration": 30, "date": "2023-01-01"}'
```

### Get Exercise Log
```bash
curl "http://localhost:3000/api/users/USER_ID/logs?from=2023-01-01&to=2023-12-31&limit=10"
```

## License

MIT 