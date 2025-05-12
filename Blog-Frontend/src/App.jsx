import React, { useState } from 'react';
import SingleTickerView from './components/features/SingleTickerView';
import CorrelationView from './components/features/CorrelationView';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState('single');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h12a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-900">StockPulse</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveView('single')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeView === 'single'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Single Stock
              </button>
              <button
                onClick={() => setActiveView('correlation')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeView === 'correlation'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Correlation
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'single' ? <SingleTickerView /> : <CorrelationView />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} StockPulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;