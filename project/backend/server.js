import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeText } from './sentiment.js';

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
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Feedback table
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
    
    // Keywords table
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

// API Routes
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
    
    // Analyze sentiment
    const analysis = await analyzeText(text);
    
    // Insert into database
    db.run(
      `INSERT INTO feedback (text, source, email, category, sentiment, score) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [text, source, email || null, category || null, analysis.sentiment, analysis.score],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save feedback' });
        }
        
        // Extract and save keywords (simplified)
        const feedbackId = this.lastID;
        const keywords = extractKeywords(text);
        
        const keywordInserts = keywords.map(keyword => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO keywords (feedback_id, keyword) VALUES (?, ?)',
              [feedbackId, keyword],
              err => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });
        
        Promise.all(keywordInserts)
          .then(() => {
            res.status(201).json({
              id: feedbackId,
              sentiment: analysis.sentiment,
              score: analysis.score,
              timestamp: new Date()
            });
          })
          .catch(err => {
            console.error('Error saving keywords:', err);
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
    console.error('Error processing feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get feedback with filtering
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
      console.error('Database error:', err);
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
  
  // Get sentiment counts
  db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
      SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
      SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral,
      SUM(CASE WHEN sentiment = 'urgent' THEN 1 ELSE 0 END) as urgent
    FROM feedback
  `, [], (err, counts) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve dashboard data' });
    }
    
    dashboardData.total = counts.total;
    dashboardData.positive = counts.positive;
    dashboardData.negative = counts.negative;
    dashboardData.neutral = counts.neutral;
    dashboardData.urgent = counts.urgent;
    
    // Get sentiment by source
    db.all(`
      SELECT 
        source,
        SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
        SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
      FROM feedback
      GROUP BY source
    `, [], (err, sources) => {
      if (err) {
        console.error('Database error:', err);
      } else {
        dashboardData.sourcesData = sources;
      }
      
      // Get recent feedback
      db.all(`
        SELECT id, text, sentiment, source, datetime(created_at) as date
        FROM feedback
        ORDER BY created_at DESC
        LIMIT 5
      `, [], (err, recent) => {
        if (err) {
          console.error('Database error:', err);
        } else {
          dashboardData.recentFeedback = recent;
        }
        
        // Get top keywords
        db.all(`
          SELECT keyword, COUNT(*) as count
          FROM keywords
          GROUP BY keyword
          ORDER BY count DESC
          LIMIT 7
        `, [], (err, keywords) => {
          if (err) {
            console.error('Database error:', err);
          } else {
            dashboardData.keywordsData = keywords;
          }
          
          // Get sentiment over time (by month)
          db.all(`
            SELECT 
              strftime('%Y-%m', created_at) as date,
              SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
              SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
              SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
            FROM feedback
            GROUP BY date
            ORDER BY date
            LIMIT 6
          `, [], (err, trends) => {
            if (err) {
              console.error('Database error:', err);
            } else {
              dashboardData.sentimentOverTime = trends;
            }
            
            res.json(dashboardData);
          });
        });
      });
    });
  });
});

// Simple keyword extraction (in a real app, use a proper NLP library)
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});