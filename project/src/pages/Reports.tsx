import React, { useState } from 'react';
import { FileText, Download, ChevronDown, Filter, Search } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'All Feedback' },
    { id: 'positive', label: 'Positive' },
    { id: 'negative', label: 'Negative' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'urgent', label: 'Urgent' },
  ];

  const mockFeedback = [
    {
      id: 1,
      text: "The new online application system is so much easier to use than the old one. I was able to complete everything in just a few minutes!",
      sentiment: "positive",
      source: "Website",
      date: "2023-05-15",
      category: "Website",
      score: 0.87
    },
    {
      id: 2,
      text: "I waited for over 2 hours at the DMV and the staff was very unfriendly. This is completely unacceptable!",
      sentiment: "negative",
      source: "Survey",
      date: "2023-05-14",
      category: "Wait Times",
      score: -0.76
    },
    {
      id: 3, 
      text: "The water in our neighborhood has been brown for 3 days. This is a health hazard that needs immediate attention!",
      sentiment: "urgent",
      source: "Email",
      date: "2023-05-13",
      category: "Facilities",
      score: -0.92
    },
    {
      id: 4,
      text: "I received my permit in the mail yesterday. The process took about the time I expected.",
      sentiment: "neutral",
      source: "Survey",
      date: "2023-05-12",
      category: "Process",
      score: 0.12
    },
    {
      id: 5,
      text: "The park cleanup initiative has made a huge difference in our community. Great job to all involved!",
      sentiment: "positive",
      source: "Twitter",
      date: "2023-05-11",
      category: "Facilities",
      score: 0.94
    },
    {
      id: 6,
      text: "The pothole on Main Street has damaged multiple cars and is getting worse. Need urgent repair!",
      sentiment: "urgent",
      source: "Phone",
      date: "2023-05-10",
      category: "Facilities",
      score: -0.88
    },
    {
      id: 7,
      text: "Can you tell me what time the library opens on Saturdays?",
      sentiment: "neutral",
      source: "Email",
      date: "2023-05-09",
      category: "General",
      score: 0.03
    }
  ];

  const filteredFeedback = activeTab === 'all' 
    ? mockFeedback 
    : mockFeedback.filter(item => item.sentiment === activeTab);

  const getSentimentBadgeStyle = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-success-100 text-success-800';
      case 'negative': return 'bg-error-100 text-error-800';
      case 'neutral': return 'bg-primary-100 text-primary-800';
      case 'urgent': return 'bg-warning-100 text-warning-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-neutral-900">Feedback Reports</h1>
        <button className="px-3 py-2 bg-primary-600 text-white rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0">
          <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
              />
            </div>
            <button className="px-3 py-2 border border-neutral-200 rounded-lg flex items-center space-x-1 hover:bg-neutral-50">
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider rounded-tl-lg">
                  Feedback
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFeedback.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-4 py-4 text-sm text-neutral-800 max-w-xs truncate">
                    {item.text}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadgeStyle(item.sentiment)}`}>
                      {item.sentiment}
                      <span className="ml-1 text-xs">({item.score.toFixed(2)})</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-600">
                    {item.source}
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-600">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-600">
                    {item.date}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button className="text-primary-600 hover:text-primary-800 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing {filteredFeedback.length} of {mockFeedback.length} entries
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
              2
            </button>
            <button className="px-3 py-1 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center mb-4">
          <FileText size={20} className="text-primary-500 mr-2" />
          <h2 className="text-lg font-display font-semibold text-neutral-900">Saved Reports</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Monthly Feedback Summary', date: '2023-05-01', type: 'PDF' },
            { name: 'Q1 Sentiment Analysis', date: '2023-04-15', type: 'Excel' },
            { name: 'Service Quality Report', date: '2023-03-22', type: 'PDF' },
          ].map((report, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-neutral-800">{report.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1">Generated: {report.date}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded-md">
                  {report.type}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-between">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View
                </button>
                <button className="text-sm text-neutral-700 hover:text-neutral-900 flex items-center">
                  <Download size={14} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;