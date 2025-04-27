import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  Inbox, AlertCircle, ThumbsUp, MessageSquareText,
  TrendingUp, Filter, Scale
} from 'lucide-react';
import SentimentCard from '../components/SentimentCard';
import Sidebar from '../components/Sidebar'; // Sidebar component
import { fetchDashboardData } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    urgent: 0,
    sentimentOverTime: [],
    sourcesData: [],
    keywordsData: [],
    recentFeedback: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = ['#00C851', '#FF4444', '#3366CC', '#FFBB33'];

  const sentimentData = [
    { name: 'Positive', value: data.positive },
    { name: 'Negative', value: data.negative },
    { name: 'Neutral', value: data.neutral },
    { name: 'Urgent', value: data.urgent }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-neutral-50 overflow-y-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-semibold text-neutral-900">Dashboard</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg flex items-center space-x-1 hover:bg-neutral-50 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <select className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <SentimentCard 
                title="Total Feedback" 
                value={data.total} 
                icon={<Inbox className="text-primary-500" />} 
                bgColor="bg-primary-50"
                textColor="text-primary-700"
                trend={{ value: 12, label: 'vs last month' }}
              />
              <SentimentCard 
                title="Positive" 
                value={data.positive} 
                percentage={data.total ? Math.round((data.positive / data.total) * 100) : 0}
                icon={<ThumbsUp className="text-success-500" />} 
                bgColor="bg-success-50"
                textColor="text-success-700"
              />
              <SentimentCard 
                title="Negative" 
                value={data.negative} 
                percentage={data.total ? Math.round((data.negative / data.total) * 100) : 0}
                icon={<MessageSquareText className="text-error-500" />} 
                bgColor="bg-error-50"
                textColor="text-error-700"
              />
              <SentimentCard 
                title="Neutral" 
                value={data.neutral} 
                percentage={data.total ? Math.round((data.neutral / data.total) * 100) : 0}
                icon={<Scale className="text-primary-500" />} 
                bgColor="bg-primary-50"
                textColor="text-primary-700"
              />
              <SentimentCard 
                title="Urgent Issues" 
                value={data.urgent} 
                icon={<AlertCircle className="text-warning-500" />} 
                bgColor="bg-warning-50"
                textColor="text-warning-700"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-neutral-900">Sentiment Distribution</h2>
                  <div className="text-sm text-neutral-500">Total: {data.total}</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-neutral-900">Feedback by Source</h2>
                  <div className="text-sm text-neutral-500">Last 30 days</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sourcesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positive" fill="#00C851" />
                      <Bar dataKey="negative" fill="#FF4444" />
                      <Bar dataKey="neutral" fill="#3366CC" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-semibold text-neutral-900">Sentiment Trends</h2>
                <div className="flex items-center text-primary-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">+5.2% from last month</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.sentimentOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positive" stroke="#00C851" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="negative" stroke="#FF4444" />
                    <Line type="monotone" dataKey="neutral" stroke="#3366CC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
                <h2 className="font-display font-semibold text-neutral-900 mb-4">Recent Feedback</h2>
                <div className="space-y-4">
                  {data.recentFeedback.map((item) => (
                    <div key={item.id} className="p-3 border border-neutral-100 rounded-lg hover:border-neutral-200 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.sentiment === 'positive' ? 'bg-success-500' :
                            item.sentiment === 'negative' ? 'bg-error-500' :
                            item.sentiment === 'urgent' ? 'bg-warning-500' : 'bg-primary-500'
                          }`}></div>
                          <span className="text-sm font-medium text-neutral-700">{item.source}</span>
                        </div>
                        <span className="text-xs text-neutral-500">{item.date}</span>
                      </div>
                      <p className="mt-2 text-neutral-800">{item.text}</p>
                      <div className="mt-2 flex items-center text-xs font-medium text-neutral-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          item.sentiment === 'positive' ? 'bg-success-100 text-success-800' :
                          item.sentiment === 'negative' ? 'bg-error-100 text-error-800' :
                          item.sentiment === 'urgent' ? 'bg-warning-100 text-warning-800' : 'bg-primary-100 text-primary-800'
                        }`}>
                          {item.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All Feedback
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-display font-semibold text-neutral-900 mb-4">Common Keywords</h2>
                <div className="space-y-3">
                  {data.keywordsData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full bg-neutral-100 rounded-full h-2.5">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full"
                          style={{ width: `${item.count}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-neutral-700 min-w-[80px]">{item.keyword}</span>
                      <span className="ml-auto text-sm text-neutral-500">{item.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Insight</h3>
                  <p className="text-sm text-neutral-600">
                    "Service" and "Wait Times" are frequently mentioned in negative feedback. Consider improving these areas for better satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
