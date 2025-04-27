import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [twitterData, setTwitterData] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchTwitter();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      setDashboardData(res.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  const fetchTwitter = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/twitter');
      console.log('Fetched Twitter Data:', res.data);
      setTwitterData(res.data.data || []);
    } catch (error) {
      console.error('Error fetching Twitter data', error);
    }
  };
  
  

  if (!dashboardData) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h1>

      {/* Sentiment Counts */}
      {dashboardData.sentimentCounts && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(dashboardData.sentimentCounts).map(([key, value]) => (
            <div key={key} className="p-4 bg-white rounded-xl shadow text-center">
              <p className="text-gray-500 capitalize">{key}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Sources */}
      {dashboardData.sourcesData?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📥 Feedback Sources</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Source</th>
                  <th className="p-2">Positive</th>
                  <th className="p-2">Negative</th>
                  <th className="p-2">Neutral</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.sourcesData.map((source) => (
                  <tr key={source.source} className="border-t">
                    <td className="p-2 capitalize">{source.source}</td>
                    <td className="p-2">{source.positive}</td>
                    <td className="p-2">{source.negative}</td>
                    <td className="p-2">{source.neutral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Keywords */}
      {dashboardData.keywordsData?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔑 Top Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {dashboardData.keywordsData.map((keyword) => (
              <span key={keyword.keyword} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {keyword.keyword} ({keyword.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment Over Time */}
      {dashboardData.sentimentOverTime?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📈 Sentiment Trends</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Month</th>
                  <th className="p-2">Positive</th>
                  <th className="p-2">Negative</th>
                  <th className="p-2">Neutral</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.sentimentOverTime.map((trend) => (
                  <tr key={trend.date} className="border-t">
                    <td className="p-2">{trend.date}</td>
                    <td className="p-2">{trend.positive}</td>
                    <td className="p-2">{trend.negative}</td>
                    <td className="p-2">{trend.neutral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      {dashboardData.recentFeedback?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📝 Recent Feedback</h2>
          <div className="space-y-4">
            {dashboardData.recentFeedback.map((fb) => (
              <div key={fb.id} className="p-4 bg-gray-50 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">
                  {fb.date ? new Date(fb.date).toLocaleString() : 'Unknown date'}
                </p>
                <p className="mt-1 text-gray-700">{fb.text}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {fb.sentiment}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {fb.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 Live Twitter Feed */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🐦 Live Tweets</h2>
        <div className="space-y-4">
          {twitterData.length === 0 ? (
            <p className="text-gray-500">No tweets found.</p>
          ) : (
            twitterData.map((tweet) => (
              <div key={tweet.id} className="p-4 bg-blue-50 rounded-xl shadow-sm">
                <p className="text-gray-700">{tweet.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {tweet.created_at ? new Date(tweet.created_at).toLocaleString() : 'Unknown time'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
