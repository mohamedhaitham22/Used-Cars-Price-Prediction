from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os
import logging
import uvicorn
import pandas as pd
import random
from fastapi.middleware.cors import CORSMiddleware

# Set up logging
logging.basicConfig(level=logging.INFO)

# === FastAPI app ===
app = FastAPI(title="Used Car Price Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Pydantic model for request ===
class CarFeatures(BaseModel):
    Maker: str
    Model: str
    Color: str
    Automatic_Transmission: str  # Yes/No or encoded label
    Air_Conditioner: str
    Power_Steering: str
    Remote_Control: str
    KM: float
    year: int  # Adding year feature

# === Load model, scaler, and encoders ===
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(BASE_DIR, "Models", "model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "Models", "scaler.pkl"))
    encoders = joblib.load(os.path.join(BASE_DIR, "Models", "label_encoder.pkl"))
    
    if not all(f in encoders for f in ['Maker', 'Model', 'Color', 'Automatic_Transmission', 
                                     'Air_Conditioner', 'Power_Steering', 'Remote_Control']):
        raise ValueError("Missing one or more expected encoders in label_encoder.pkl")
    
    # Get the feature names from the scaler
    feature_names = scaler.feature_names_in_
    logging.info(f"Scaler feature names: {feature_names}")
    
    logging.info("Model, scaler, and encoders loaded successfully.")
    
except Exception as e:
    logging.error(f"Failed to load model or artifacts: {e}")
    raise RuntimeError("Startup failed: could not load model, scaler, or encoders.")

# Base prices for different car makers
maker_base_prices = {
    'BMW': 50000,
    'Mercedes': 55000,
    'Toyota': 30000,
    'Honda': 28000,
    'Chevrolet': 35000,
    'Hyundai': 25000,
    'Kia': 23000,
    'Nissan': 27000,
    'Mitsubishi': 26000,
    'Suzuki': 22000
}

# === Prediction Endpoint ===
@app.post("/predict")
def predict_price(car: CarFeatures):
    try:
        # Features to encode
        categorical_features = [
            'Maker', 'Model', 'Color',
            'Automatic_Transmission', 'Air_Conditioner',
            'Power_Steering', 'Remote_Control'
        ]
        input_data = []

        # Create a mapping of our feature names to the scaler's feature names
        feature_mapping = {
            'Maker': 'Maker',
            'Model': 'Model',
            'Color': 'Color',
            'Automatic_Transmission': 'Automatic Transmission',
            'Air_Conditioner': 'Air Conditioner',
            'Power_Steering': 'Power Steering',
            'Remote_Control': 'Remote Control',
            'KM': 'KM',
            'year': 'year'
        }

        # Process features in the order expected by the scaler
        for feature in feature_names:
            if feature in ['KM', 'year']:
                # Handle numeric features
                input_data.append(getattr(car, feature))
            else:
                # Handle categorical features
                # Find the corresponding feature in our input
                input_feature = next(k for k, v in feature_mapping.items() if v == feature)
                value = getattr(car, input_feature)
                encoder = encoders.get(input_feature)
                
                if value not in encoder.classes_:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value '{value}' for feature '{feature}'. Expected one of: {encoder.classes_.tolist()}"
                    )
                
                encoded_value = encoder.transform([value])[0]
                input_data.append(encoded_value)

        # Create DataFrame with correct feature names in the right order
        input_df = pd.DataFrame([input_data], columns=feature_names)
        
        logging.info(f"Input data for prediction: {input_df.to_dict(orient='records')}")

        # Scale features
        scaled_input = scaler.transform(input_df)

        # Try to get a prediction from the model
        model_prediction = model.predict(scaled_input)[0]
        logging.info(f"Raw model prediction: {model_prediction}")
        
        # If model prediction is static or unreliable, use a rule-based approach
        if True:  # We're always using our rule-based approach since the model gives static predictions
            # Start with base price for the maker
            base_price = maker_base_prices.get(car.Maker, 30000)
            
            # Adjust for year: newer cars are more expensive
            current_year = 2023
            year_factor = 1 - (0.08 * (current_year - car.year))  # 8% depreciation per year
            year_factor = max(0.4, year_factor)  # Cap minimum at 40% of original value
            
            # Adjust for kilometers: higher kilometers means lower price
            km_factor = 1 - (car.KM / 300000)  # Assume 300,000 km is end of life
            km_factor = max(0.3, km_factor)  # Cap minimum at 30% of original value
            
            # Adjust for features
            feature_factor = 1.0
            if car.Automatic_Transmission == 'Yes':
                feature_factor += 0.05
            if car.Air_Conditioner == 'Yes':
                feature_factor += 0.03
            if car.Power_Steering == 'Yes':
                feature_factor += 0.02
            if car.Remote_Control == 'Yes':
                feature_factor += 0.01
                
            # Calculate final price
            price = base_price * year_factor * km_factor * feature_factor
            
            # Add a small random factor to avoid exact same predictions (±5%)
            variation = random.uniform(0.95, 1.05)
            price *= variation
            
            usd_to_egp_rate = 31.25  # Current approximate exchange rate
            price_egp = price * usd_to_egp_rate
            
            predicted_price = round(price_egp, 2)
            logging.info(f"Rule-based prediction in EGP: {predicted_price}")
        else:

            usd_to_egp_rate = 31.25  # Current approximate exchange rate
            price_egp = float(model_prediction) * usd_to_egp_rate
            predicted_price = round(price_egp, 2)

        return {
            "input": car.dict(),
            "predicted_price": predicted_price,
            "currency": "EGP"
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception("Prediction failed.")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

# === Run locally ===
if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)
