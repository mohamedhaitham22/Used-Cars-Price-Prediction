import React from 'react';
import { Car } from './components/icons/Car';
import PredictionForm from './components/PredictionForm';
import { PredictionProvider } from './context/PredictionContext';

function App() {
  return (
    <PredictionProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-800" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">Egyptian cars price prediction</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <PredictionForm />
          </div>
        </main>
        
        <footer className="mt-auto bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Egyptian cars price prediction. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PredictionProvider>
  );
}

export default App;