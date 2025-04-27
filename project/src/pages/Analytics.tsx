import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { SlidersIcon as SliderIcon, DownloadIcon, Calendar, TrendingUp, Layers, CloudLightning } from 'lucide-react';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('sentiment');
  
  const sentimentData = [
    { month: 'Jan', positive: 65, negative: 28, neutral: 37 },
    { month: 'Feb', positive: 59, negative: 48, neutral: 43 },
    { month: 'Mar', positive: 80, negative: 40, neutral: 30 },
    { month: 'Apr', positive: 81, negative: 19, neutral: 50 },
    { month: 'May', positive: 56, negative: 86, neutral: 27 },
    { month: 'Jun', positive: 55, negative: 27, neutral: 68 },
    { month: 'Jul', positive: 87, negative: 35, neutral: 28 },
  ];

  const sourceData = [
    { name: 'Website', value: 400 },
    { name: 'Survey', value: 300 },
    { name: 'Social', value: 200 },
    { name: 'Email', value: 100 },
    { name: 'Phone', value: 80 },
  ];

  const categoryData = [
    { category: 'Service', count: 156 },
    { category: 'Wait Times', count: 120 },
    { category: 'Staff', count: 98 },
    { category: 'Facilities', count: 86 },
    { category: 'Website', count: 64 },
    { category: 'Process', count: 58 },
    { category: 'Other', count: 22 },
  ];

  const trendData = [
    { date: '1/1', sentiment: 4.2 },
    { date: '2/1', sentiment: 4.5 },
    { date: '3/1', sentiment: 3.8 },
    { date: '4/1', sentiment: 3.2 },
    { date: '5/1', sentiment: 3.6 },
    { date: '6/1', sentiment: 4.0 },
    { date: '7/1', sentiment: 4.3 },
  ];

  const COLORS = ['#3366CC', '#FF4444', '#00C851', '#FFBB33', '#FF9900'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600 mt-1">Deeper insights into feedback patterns and trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-neutral-200 px-3 py-1.5">
            <Calendar size={16} className="text-neutral-500" />
            <select className="bg-transparent border-none text-sm focus:outline-none pr-6">
              <option>Last 30 days</option>
              <option>Last quarter</option>
              <option>Last year</option>
              <option>Custom range</option>
            </select>
          </div>
          <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm flex items-center hover:bg-neutral-50">
            <DownloadIcon size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Feedback', value: '1,248', change: '+12%', icon: <Layers size={20} className="text-primary-500" /> },
          { title: 'Avg. Sentiment Score', value: '3.8', change: '+0.2', icon: <TrendingUp size={20} className="text-success-500" /> },
          { title: 'Negative Feedback', value: '283', change: '-5%', icon: <CloudLightning size={20} className="text-error-500" /> },
          { title: 'Response Rate', value: '92%', change: '+3%', icon: <SliderIcon size={20} className="text-warning-500" /> },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-neutral-500 text-sm">{item.title}</p>
                <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{item.value}</h3>
              </div>
              <div className="bg-neutral-100 p-2 rounded-lg">
                {item.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className={`text-xs font-medium ${item.change.startsWith('+') ? 'text-success-600' : 'text-error-600'}`}>
                {item.change}
              </span>
              <span className="text-xs text-neutral-500 ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="px-4 py-3 flex space-x-1 overflow-x-auto">
            {[
              { id: 'sentiment', label: 'Sentiment Over Time' },
              { id: 'sources', label: 'Feedback Sources' },
              { id: 'categories', label: 'Categories' },
              { id: 'trends', label: 'Trends' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4">
          <div className="h-[400px]">
            {activeTab === 'sentiment' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sentimentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" stackId="a" fill="#00C851" name="Positive" />
                  <Bar dataKey="negative" stackId="a" fill="#FF4444" name="Negative" />
                  <Bar dataKey="neutral" stackId="a" fill="#3366CC" name="Neutral" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'sources' && (
              <div className="flex flex-col md:flex-row items-center justify-center h-full">
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 p-6 space-y-4">
                  <h3 className="text-lg font-medium text-neutral-900">Key Insights</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-700">• Website feedback represents the largest source (40%)</p>
                    <p className="text-sm text-neutral-700">• Survey response rate has increased by 15% since last quarter</p>
                    <p className="text-sm text-neutral-700">• Social media feedback is growing the fastest (+23%)</p>
                    <p className="text-sm text-neutral-700">• Email feedback has the highest average sentiment score (4.2/5)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3366CC" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'trends' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => [`${value}/5`, 'Avg. Sentiment']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#3366CC" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Average Sentiment"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Most Common Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { text: 'service', size: 'text-2xl', weight: 'font-semibold', color: 'text-primary-700' },
              { text: 'wait time', size: 'text-xl', weight: 'font-medium', color: 'text-error-700' },
              { text: 'helpful', size: 'text-lg', weight: 'font-medium', color: 'text-success-700' },
              { text: 'staff', size: 'text-xl', weight: 'font-medium', color: 'text-neutral-700' },
              { text: 'website', size: 'text-base', weight: 'font-normal', color: 'text-primary-600' },
              { text: 'easy', size: 'text-lg', weight: 'font-medium', color: 'text-success-600' },
              { text: 'parking', size: 'text-base', weight: 'font-normal', color: 'text-error-600' },
              { text: 'forms', size: 'text-sm', weight: 'font-normal', color: 'text-neutral-600' },
              { text: 'slow', size: 'text-lg', weight: 'font-medium', color: 'text-error-700' },
              { text: 'clean', size: 'text-base', weight: 'font-normal', color: 'text-success-600' },
              { text: 'difficult', size: 'text-base', weight: 'font-medium', color: 'text-error-600' },
              { text: 'professional', size: 'text-lg', weight: 'font-medium', color: 'text-success-700' },
              { text: 'hours', size: 'text-sm', weight: 'font-normal', color: 'text-neutral-600' },
              { text: 'friendly', size: 'text-lg', weight: 'font-medium', color: 'text-success-600' },
              { text: 'information', size: 'text-base', weight: 'font-normal', color: 'text-primary-600' },
              { text: 'outdated', size: 'text-base', weight: 'font-normal', color: 'text-error-600' },
              { text: 'efficient', size: 'text-base', weight: 'font-medium', color: 'text-success-600' },
            ].map((keyword, index) => (
              <div 
                key={index} 
                className={`${keyword.size} ${keyword.weight} ${keyword.color} px-3 py-1 rounded-full bg-opacity-10 ${keyword.color.replace('text', 'bg')}`}
              >
                {keyword.text}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Actionable Insights</h2>
          <div className="space-y-4">
            {[
              { 
                title: 'Improve Wait Times', 
                description: 'Wait times are mentioned in 28% of negative feedback. Consider adding more staff during peak hours.',
                priority: 'High',
                priorityColor: 'bg-error-100 text-error-800' 
              },
              { 
                title: 'Staff Training', 
                description: 'Customer service skills were highlighted in both positive and negative feedback. Consider additional training.',
                priority: 'Medium',
                priorityColor: 'bg-warning-100 text-warning-800'
              },
              { 
                title: 'Website Navigation', 
                description: 'Users report difficulty finding forms online. A website redesign could improve satisfaction.',
                priority: 'Medium',
                priorityColor: 'bg-warning-100 text-warning-800'
              },
              { 
                title: 'Expand Online Services', 
                description: 'Positive feedback about online options suggests expanding digital services would be well-received.',
                priority: 'Low',
                priorityColor: 'bg-success-100 text-success-800'
              },
            ].map((insight, index) => (
              <div key={index} className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-neutral-800">{insight.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${insight.priorityColor}`}>
                    {insight.priority} Priority
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;