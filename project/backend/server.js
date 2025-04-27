import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeText } from './sentiment.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database setup
const dbPath = join(__dirname, 'feedback.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        source TEXT NOT NULL,
        email TEXT,
        category TEXT,
        sentiment TEXT NOT NULL,
        score REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS keywords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback_id INTEGER,
        keyword TEXT NOT NULL,
        FOREIGN KEY (feedback_id) REFERENCES feedback (id)
      )
    `);
    console.log('Database tables initialized');
  });
}

// Simple keyword extraction
function extractKeywords(text) {
  const commonKeywords = [
    'service', 'wait', 'time', 'staff', 'helpful', 'process',
    'website', 'online', 'form', 'parking', 'clean', 'facility'
  ];
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);

  return [...new Set(words)]
    .filter(word => commonKeywords.includes(word) && word.length > 2)
    .slice(0, 5);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Submit feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { text, source, email, category } = req.body;

    if (!text || !source) {
      return res.status(400).json({ error: 'Text and source are required' });
    }

    const analysis = await analyzeText(text);

    db.run(
      `INSERT INTO feedback (text, source, email, category, sentiment, score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [text, source, email || null, category || null, analysis.sentiment, analysis.score],
      function (err) {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Failed to save feedback' });
        }

        const feedbackId = this.lastID;
        const keywords = extractKeywords(text);

        const keywordPromises = keywords.map(keyword => new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO keywords (feedback_id, keyword) VALUES (?, ?)',
            [feedbackId, keyword],
            err => (err ? reject(err) : resolve())
          );
        }));

        Promise.all(keywordPromises)
          .then(() => {
            res.status(201).json({
              id: feedbackId,
              sentiment: analysis.sentiment,
              score: analysis.score,
              timestamp: new Date()
            });
          })
          .catch(err => {
            console.error('Error saving keywords:', err.message);
            res.status(201).json({
              id: feedbackId,
              sentiment: analysis.sentiment,
              score: analysis.score,
              timestamp: new Date()
            });
          });
      }
    );
  } catch (error) {
    console.error('Error processing feedback:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get feedback (with filters)
app.get('/api/feedback', (req, res) => {
  const { sentiment, source, startDate, endDate, limit = 100, offset = 0 } = req.query;

  let query = 'SELECT * FROM feedback WHERE 1=1';
  const params = [];

  if (sentiment) {
    query += ' AND sentiment = ?';
    params.push(sentiment);
  }
  if (source) {
    query += ' AND source = ?';
    params.push(source);
  }
  if (startDate) {
    query += ' AND created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND created_at <= ?';
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
    res.json(rows);
  });
});

// Get dashboard data
app.get('/api/dashboard', (req, res) => {
  const dashboardData = {
    sentimentCounts: {},
    sourcesData: [],
    sentimentOverTime: [],
    recentFeedback: [],
    keywordsData: []
  };

  db.get(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) AS positive,
      SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) AS negative,
      SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) AS neutral,
      SUM(CASE WHEN sentiment = 'urgent' THEN 1 ELSE 0 END) AS urgent
    FROM feedback
  `, [], (err, counts) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve dashboard data' });
    }

    dashboardData.sentimentCounts = counts;

    db.all(`
      SELECT 
        source,
        SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) AS positive,
        SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) AS negative,
        SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) AS neutral
      FROM feedback
      GROUP BY source
    `, [], (err, sources) => {
      if (!err) dashboardData.sourcesData = sources;

      db.all(`
        SELECT id, text, sentiment, source, datetime(created_at) AS date
        FROM feedback
        ORDER BY created_at DESC
        LIMIT 5
      `, [], (err, recent) => {
        if (!err) dashboardData.recentFeedback = recent;

        db.all(`
          SELECT keyword, COUNT(*) AS count
          FROM keywords
          GROUP BY keyword
          ORDER BY count DESC
          LIMIT 7
        `, [], (err, keywords) => {
          if (!err) dashboardData.keywordsData = keywords;

          db.all(`
            SELECT 
              strftime('%Y-%m', created_at) AS date,
              SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) AS positive,
              SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) AS negative,
              SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) AS neutral
            FROM feedback
            GROUP BY date
            ORDER BY date
            LIMIT 6
          `, [], (err, trends) => {
            if (!err) dashboardData.sentimentOverTime = trends;

            res.json(dashboardData);
          });
        });
      });
    });
  });
});

// Fetch recent tweets (NEW API)
app.get('/api/twitter', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent',
      {
        params: {
          query: 'customer service OR feedback OR support',
          max_results: 10,
          'tweet.fields': 'created_at,author_id,text'
        },
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tweets:', error.message);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close(err => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
