// services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Mock data for development
const mockDashboardData = {
  total: 842,
  positive: 482,
  negative: 256,
  neutral: 84,
  urgent: 20,
  sentimentOverTime: [
    { date: 'Jan', positive: 65, negative: 28, neutral: 37 },
    { date: 'Feb', positive: 59, negative: 48, neutral: 43 },
    { date: 'Mar', positive: 80, negative: 40, neutral: 30 },
    { date: 'Apr', positive: 81, negative: 19, neutral: 50 },
    { date: 'May', positive: 56, negative: 86, neutral: 27 },
    { date: 'Jun', positive: 55, negative: 27, neutral: 68 },
  ],
  sourcesData: [
    { name: 'Surveys', positive: 120, negative: 45, neutral: 30 },
    { name: 'Twitter', positive: 85, negative: 65, neutral: 15 },
    { name: 'Reviews', positive: 75, negative: 55, neutral: 10 },
    { name: 'Email', positive: 50, negative: 30, neutral: 12 },
    { name: 'Phone', positive: 35, negative: 25, neutral: 10 },
  ],
  keywordsData: [
    { keyword: 'Service', count: 76 },
    { keyword: 'Wait Times', count: 58 },
    { keyword: 'Staff', count: 45 },
    { keyword: 'Helpful', count: 37 },
    { keyword: 'Process', count: 29 },
    { keyword: 'Website', count: 23 },
    { keyword: 'Forms', count: 19 },
  ],
  recentFeedback: [
    {
      id: 1,
      text: "The online application process was incredibly smooth and user-friendly. I completed everything in just a few minutes!",
      sentiment: "positive",
      source: "Website",
      date: "2 hours ago"
    },
    {
      id: 2,
      text: "Wait times are still way too long. I had to wait over 2 hours yesterday.",
      sentiment: "negative",
      source: "Survey",
      date: "5 hours ago"
    },
    {
      id: 3,
      text: "The road on Main Street has multiple potholes that are damaging vehicles and creating hazardous conditions for drivers.",
      sentiment: "urgent",
      source: "Email",
      date: "1 day ago"
    },
    {
      id: 4,
      text: "Staff was professional but the process took longer than expected.",
      sentiment: "neutral",
      source: "Phone",
      date: "1 day ago"
    }
  ]
};

// ========== API Calls ==========

// Fetch dashboard data (REAL API)
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get('/api/dashboard-data'); // Your real endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Fetch twitter data (REAL API)
export const fetchTwitterData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/twitter');
    return response.data;
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw error;
  }
};

// ========== Mock Services (for development/demo) ==========

// Fetch dashboard data (MOCK)
export const fetchMockDashboardData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate delay
    return mockDashboardData;
  } catch (error) {
    console.error('Error fetching mock dashboard data:', error);
    throw error;
  }
};

// Submit feedback (MOCK)
export const submitFeedback = async (data) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay

    // Simulate simple sentiment analysis
    const text = data.text.toLowerCase();
    let sentiment = 'neutral';
    let score = 0.5;

    if (text.includes('great') || text.includes('good') || text.includes('excellent') || text.includes('helpful') || text.includes('thank')) {
      sentiment = 'positive';
      score = 0.8 + Math.random() * 0.2;
    } else if (text.includes('bad') || text.includes('terrible') || text.includes('awful') || text.includes('poor') || text.includes('worst')) {
      sentiment = 'negative';
      score = 0.2 + Math.random() * 0.2;
    } else if (text.includes('urgent') || text.includes('emergency') || text.includes('immediately') || text.includes('dangerous')) {
      sentiment = 'urgent';
      score = 0.1 + Math.random() * 0.2;
    } else {
      score = 0.4 + Math.random() * 0.2;
    }

    return {
      id: Math.floor(Math.random() * 1000),
      sentiment,
      score,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Fetch feedback list (MOCK)
export const fetchFeedbackList = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
    return [];
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    throw error;
  }
};
