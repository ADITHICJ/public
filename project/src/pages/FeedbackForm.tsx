import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const BulkFeedbackImport = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a CSV file to upload.');
      return;
    }
    // TODO: Upload logic here
    console.log('Uploading:', selectedFile.name);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="card p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
          Bulk Feedback Import
        </h1>

        <p className="text-neutral-600 text-sm mb-6">
          Upload a CSV file containing multiple feedback entries to analyze them at once.
        </p>

        <div className="flex items-center space-x-4 mb-8">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-300 file:rounded-md file:text-sm file:font-medium file:bg-neutral-50 hover:file:bg-neutral-100"
          />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center space-x-2 font-medium"
          >
            <UploadCloud size={18} />
            <span>Upload</span>
          </button>
        </div>

        <div className="card p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-lg font-medium text-gray-900 mb-4">CSV Format Instructions</h2>

          <p className="mb-4 text-sm text-gray-600">
            Your CSV file should include the following columns:
          </p>

          <div className="bg-white p-4 rounded-md overflow-x-auto border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Column Name</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Description</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-medium">text</td>
                  <td className="px-4 py-2">The feedback text</td>
                  <td className="px-4 py-2 text-gray-500">"The service was excellent"</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">sentiment</td>
                  <td className="px-4 py-2">Either "positive", "negative", or "neutral"</td>
                  <td className="px-4 py-2 text-gray-500">"positive"</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">source</td>
                  <td className="px-4 py-2">Where the feedback came from</td>
                  <td className="px-4 py-2 text-gray-500">"Twitter"</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">date</td>
                  <td className="px-4 py-2">The date of the feedback (YYYY-MM-DD)</td>
                  <td className="px-4 py-2 text-gray-500">"2023-05-15"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFeedbackImport;
