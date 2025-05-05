import React, { useState, useEffect } from 'react';
import { usePrediction } from '../context/PredictionContext';
import { carData } from '../data/carData';
import ToggleSwitch from './ToggleSwitch';
import PredictionResult from './PredictionResult';
import FormField from './FormField';

const currentYear = new Date().getFullYear();
const yearRange = Array.from({ length: 30 }, (_, i) => currentYear - i);

const PredictionForm: React.FC = () => {
  const { predict, prediction, loading, error } = usePrediction();
  const [formData, setFormData] = useState({
    Maker: '',
    Model: '',
    Color: '',
    Automatic_Transmission: 'Yes',
    Air_Conditioner: 'Yes',
    Power_Steering: 'Yes',
    Remote_Control: 'Yes',
    KM: '',
    year: currentYear - 5,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update available models when maker changes
  useEffect(() => {
    if (formData.Maker) {
      const maker = carData.makers.find(m => m.name === formData.Maker);
      setAvailableModels(maker?.models || []);
      if (maker?.models && !maker.models.includes(formData.Model)) {
        setFormData(prev => ({ ...prev, Model: '' }));
      }
    } else {
      setAvailableModels([]);
    }
  }, [formData.Maker]);

  // Validate form
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (touched.Maker && !formData.Maker) {
      errors.Maker = 'Please select a car maker';
    }
    
    if (touched.Model && !formData.Model) {
      errors.Model = 'Please select a car model';
    }
    
    if (touched.Color && !formData.Color) {
      errors.Color = 'Please select a color';
    }
    
    if (touched.KM) {
      if (!formData.KM) {
        errors.KM = 'Please enter kilometers driven';
      } else if (isNaN(Number(formData.KM)) || Number(formData.KM) < 0) {
        errors.KM = 'Please enter a valid positive number';
      }
    }
    
    setValidationErrors(errors);
  }, [formData, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData({ ...formData, [name]: value ? 'Yes' : 'No' });
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    // Check if there are any validation errors
    const newErrors: Record<string, string> = {};
    
    if (!formData.Maker) newErrors.Maker = 'Please select a car maker';
    if (!formData.Model) newErrors.Model = 'Please select a car model';
    if (!formData.Color) newErrors.Color = 'Please select a color';
    
    if (!formData.KM) {
      newErrors.KM = 'Please enter kilometers driven';
    } else if (isNaN(Number(formData.KM)) || Number(formData.KM) < 0) {
      newErrors.KM = 'Please enter a valid positive number';
    }
    
    setValidationErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      predict({
        ...formData,
        KM: Number(formData.KM),
        year: Number(formData.year)
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enter Car Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Maker"
              name="Maker"
              error={validationErrors.Maker}
            >
              <select
                id="Maker"
                name="Maker"
                value={formData.Maker}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-800 focus:border-blue-800 rounded-md shadow-sm"
              >
                <option value="">Select Maker</option>
                {carData.makers.map((maker) => (
                  <option key={maker.name} value={maker.name}>
                    {maker.name}
                  </option>
                ))}
              </select>
            </FormField>
            
            <FormField
              label="Model"
              name="Model"
              error={validationErrors.Model}
            >
              <select
                id="Model"
                name="Model"
                value={formData.Model}
                onChange={handleInputChange}
                disabled={!formData.Maker}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-800 focus:border-blue-800 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Model</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </FormField>
            
            <FormField
              label="Color"
              name="Color"
              error={validationErrors.Color}
            >
              <select
                id="Color"
                name="Color"
                value={formData.Color}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-800 focus:border-blue-800 rounded-md shadow-sm"
              >
                <option value="">Select Color</option>
                {carData.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </FormField>
            
            <FormField
              label="Year"
              name="year"
            >
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-800 focus:border-blue-800 rounded-md shadow-sm"
              >
                {yearRange.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </FormField>
            
            <FormField
              label="Kilometers Driven"
              name="KM"
              error={validationErrors.KM}
            >
              <input
                type="number"
                id="KM"
                name="KM"
                value={formData.KM}
                onChange={handleInputChange}
                placeholder="e.g., 50000"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800"
              />
            </FormField>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ToggleSwitch
                label="Automatic Transmission"
                enabled={formData.Automatic_Transmission === 'Yes'}
                onChange={(enabled) => handleToggleChange('Automatic_Transmission', enabled)}
              />
              
              <ToggleSwitch
                label="Air Conditioner"
                enabled={formData.Air_Conditioner === 'Yes'}
                onChange={(enabled) => handleToggleChange('Air_Conditioner', enabled)}
              />
              
              <ToggleSwitch
                label="Power Steering"
                enabled={formData.Power_Steering === 'Yes'}
                onChange={(enabled) => handleToggleChange('Power_Steering', enabled)}
              />
              
              <ToggleSwitch
                label="Remote Control"
                enabled={formData.Remote_Control === 'Yes'}
                onChange={(enabled) => handleToggleChange('Remote_Control', enabled)}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Predicting...
                </>
              ) : (
                'Predict Price'
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {prediction && <PredictionResult prediction={prediction} />}
      </div>
    </div>
  );
};

export default PredictionForm;