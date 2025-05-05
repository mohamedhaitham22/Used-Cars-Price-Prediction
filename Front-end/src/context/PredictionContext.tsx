import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CarFeatures, Prediction } from '../types';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PredictionContextType {
  predict: (data: CarFeatures) => Promise<void>;
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

interface PredictionProviderProps {
  children: ReactNode;
}

export const PredictionProvider: React.FC<PredictionProviderProps> = ({ children }) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (data: CarFeatures) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction');
      }
      
      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PredictionContext.Provider value={{ predict, prediction, loading, error }}>
      {children}
    </PredictionContext.Provider>
  );
};