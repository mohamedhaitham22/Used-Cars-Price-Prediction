import React, { useState, useEffect } from 'react';
import { PriceCurrency } from './icons/PriceCurrency';
import { Prediction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PredictionResultProps {
  prediction: Prediction;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    setShowResult(false);
    const timer = setTimeout(() => {
      setShowResult(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [prediction]);
  
  return (
    <div className="mt-8">
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Prediction Result</h3>
        
        <div 
          className={`bg-gradient-to-r from-blue-800 to-teal-600 rounded-lg overflow-hidden shadow-lg transition-all duration-700 ease-out transform ${
            showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="px-6 py-8 text-center">
            <PriceCurrency className="w-12 h-12 mx-auto text-white" />
            <h4 className="mt-4 text-white text-xl font-medium">Estimated Price</h4>
            <div className="mt-2 flex items-center justify-center">
              <span className="text-white text-4xl font-bold tabular-nums">
                {formatCurrency(prediction.predicted_price)}
              </span>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-white text-sm">
              <div className="text-right font-medium">Make:</div>
              <div className="text-left">{prediction.input.Maker}</div>
              
              <div className="text-right font-medium">Model:</div>
              <div className="text-left">{prediction.input.Model}</div>
              
              <div className="text-right font-medium">Year:</div>
              <div className="text-left">{prediction.input.year}</div>
              
              <div className="text-right font-medium">Kilometers:</div>
              <div className="text-left">{Number(prediction.input.KM).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;