import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ChevronDown, Bell, Lock, Users, Database, RefreshCw } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  
  const menuItems = [
    { id: 'general', label: 'General Settings', icon: <SettingsIcon size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'users', label: 'Users & Permissions', icon: <Users size={18} /> },
    { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
    { id: 'model', label: 'Model Training', icon: <RefreshCw size={18} /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-display font-semibold text-neutral-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200">
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-primary-500' : ''}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="flex-1 p-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="app-name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Application Name
                      </label>
                      <input
                        type="text"
                        id="app-name"
                        defaultValue="Public Service Feedback Analyzer"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="timeZone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Default Time Zone
                      </label>
                      <select
                        id="timeZone"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST" selected>Eastern Time (EST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date-format" className="block text-sm font-medium text-neutral-700 mb-1">
                        Date Format
                      </label>
                      <select
                        id="date-format"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center">
                        <input
                          id="auto-refresh"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="auto-refresh" className="ml-2 block text-sm text-neutral-700">
                          Enable auto-refresh on dashboard (every 5 minutes)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-display font-semibold text-neutral-900 mb-3">Theme Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Color Theme
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: 'Default', color: '#3366CC', selected: true },
                          { name: 'Ocean', color: '#00A99D' },
                          { name: 'Forest', color: '#2E7D32' },
                          { name: 'Sunset', color: '#FF9900' },
                        ].map((theme) => (
                          <div 
                            key={theme.name}
                            className={`cursor-pointer p-3 rounded-lg border ${theme.selected ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-200 hover:border-primary-200'}`}
                          >
                            <div 
                              className="w-full h-6 rounded mb-2"
                              style={{ backgroundColor: theme.color }}
                            />
                            <div className="text-sm text-center">{theme.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Dashboard Layout
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: 'Default', selected: true },
                          { name: 'Compact' },
                          { name: 'Expanded' },
                        ].map((layout) => (
                          <div 
                            key={layout.name}
                            className={`cursor-pointer p-3 rounded-lg border ${layout.selected ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-200 hover:border-primary-200'}`}
                          >
                            <div className="h-12 bg-neutral-100 rounded mb-2 flex items-center justify-center">
                              <div className={`${layout.name === 'Compact' ? 'w-1/2' : layout.name === 'Expanded' ? 'w-3/4' : 'w-2/3'} h-4 bg-neutral-300 rounded`}></div>
                            </div>
                            <div className="text-sm text-center">{layout.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'model' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Model Training</h2>
                  <p className="text-neutral-600 mb-4">
                    Configure and train your sentiment analysis model to improve accuracy for your specific use case.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="model-type" className="block text-sm font-medium text-neutral-700 mb-1">
                        Model Type
                      </label>
                      <select
                        id="model-type"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="naiveBayes" selected>Naive Bayes (Default)</option>
                        <option value="logistic">Logistic Regression</option>
                        <option value="svm">Support Vector Machine</option>
                        <option value="bert">BERT (Advanced)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="threshold" className="block text-sm font-medium text-neutral-700 mb-1">
                        Urgency Detection Threshold (0-1)
                      </label>
                      <input
                        type="range"
                        id="threshold"
                        min="0"
                        max="1"
                        step="0.05"
                        defaultValue="0.75"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Less Sensitive</span>
                        <span>0.75</span>
                        <span>More Sensitive</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Custom Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Service Quality", "Wait Times", "Staff Behavior", 
                          "Facilities", "Website", "General"
                        ].map((cat, index) => (
                          <div key={index} className="bg-neutral-100 px-3 py-1 rounded-full text-sm font-medium text-neutral-700 flex items-center">
                            {cat}
                            <button className="ml-1 text-neutral-500 hover:text-neutral-700">×</button>
                          </div>
                        ))}
                        <button className="bg-primary-50 px-3 py-1 rounded-full text-sm font-medium text-primary-700">
                          + Add Category
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-md font-medium text-neutral-800 mb-3">Training Data</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="text-neutral-600">Current model trained on 2,456 samples</div>
                        <div className="text-neutral-600">Last trained: Jun 12, 2023</div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Train Model
                        </button>
                        <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                          Upload Training Data
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                      <h3 className="text-md font-medium text-neutral-800 mb-2">Model Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Accuracy:</span>
                          <span className="text-sm font-medium">87.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">F1 Score:</span>
                          <span className="text-sm font-medium">0.85</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Precision:</span>
                          <span className="text-sm font-medium">0.83</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Recall:</span>
                          <span className="text-sm font-medium">0.88</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeSection !== 'general' && activeSection !== 'model') && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {menuItems.find(item => item.id === activeSection)?.icon}
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800">
                    {menuItems.find(item => item.id === activeSection)?.label}
                  </h3>
                  <p className="text-neutral-600 mt-2 max-w-md">
                    This section is part of the extended functionality and would be implemented in the full version.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-neutral-200 flex justify-end">
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Save size={18} className="mr-1" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;