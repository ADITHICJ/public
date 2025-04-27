import React, { useState } from 'react';
import { MessageSquareText, Send, AlertTriangle } from 'lucide-react';
import { submitFeedback } from '../services/api';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    text: '',
    source: 'manual',
    email: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { sentiment: string; score: number }>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text) {
      setError('Please enter feedback text');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const response = await submitFeedback(formData);
      setResult(response);
      // Reset form except email
      setFormData(prev => ({
        text: '',
        source: 'manual',
        email: prev.email,
        category: '',
      }));
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch(sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      case 'urgent': return '⚠️';
      default: return '❓';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-success-50 text-success-700 border-success-200';
      case 'negative': return 'bg-error-50 text-error-700 border-error-200';
      case 'neutral': return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'urgent': return 'bg-warning-50 text-warning-700 border-warning-200';
      default: return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-neutral-900">Submit Feedback</h1>
        <p className="text-neutral-600 mt-1">
          Enter feedback to analyze sentiment or manually submit feedback from other sources.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg flex items-center text-error-700">
            <AlertTriangle size={18} className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={`mb-6 p-4 border rounded-lg animate-fade-in ${getSentimentColor(result.sentiment)}`}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getSentimentEmoji(result.sentiment)}</span>
              <div>
                <h3 className="font-medium text-lg capitalize">{result.sentiment} Feedback</h3>
                <p>Sentiment score: {result.score.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-neutral-700 mb-1">
                Feedback Text
              </label>
              <textarea
                id="text"
                name="text"
                rows={5}
                value={formData.text}
                onChange={handleChange}
                placeholder="Enter feedback text here..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-neutral-700 mb-1">
                  Source
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="survey">Survey</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="service">Service Quality</option>
                  <option value="wait_times">Wait Times</option>
                  <option value="staff">Staff Behavior</option>
                  <option value="facilities">Facilities</option>
                  <option value="process">Process</option>
                  <option value="website">Website</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Provide your email if you'd like to receive a response to your feedback.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-colors ${
                  submitting
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
            <MessageSquareText size={18} className="mr-2 text-primary-500" />
            Bulk Feedback Import
          </h3>
          <p className="text-neutral-600 text-sm mb-3">
            Need to analyze multiple feedback entries at once? Use our bulk import feature to upload CSV files from surveys or other feedback sources.
          </p>
          <button className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors font-medium">
            Import CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;