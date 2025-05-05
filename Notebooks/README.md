# Egyptian Used Cars Price Prediction Notebook

This Jupyter notebook contains the data analysis, preprocessing, and model training process for the Egyptian Used Cars Price Prediction project.

## Dataset Overview

The notebook uses a dataset of used car listings from Egypt, scraped from hatla2ee.com. The dataset includes various features such as:

- Car make and model
- Price in Egyptian Pounds (EGP)
- Color
- Mileage (kilometers driven)
- Manufacturing year
- Additional features (automatic transmission, air conditioner, power steering, remote control)
- Location information

## Data Preprocessing Steps

The notebook performs the following preprocessing steps:

1. **Data Cleaning**:
   - Removing rows with missing values
   - Extracting year from the car name
   - Dropping unnecessary columns (City, Date Displayed, Item URL, Name)

2. **Feature Engineering**:
   - Cleaning price data (removing 'EGP' and commas, converting to float)
   - Cleaning mileage data (removing 'Km' and commas, converting to integer)
   - Renaming columns for consistency ('Mileage' → 'KM', 'Make' → 'Maker')

3. **Categorical Encoding**:
   - Using Label Encoding for categorical features:
     - Maker (car manufacturer)
     - Model
     - Color
     - Automatic Transmission
     - Air Conditioner
     - Power Steering
     - Remote Control

## Model Training

The notebook trains an XGBoost regression model to predict car prices:

1. **Data Splitting**:
   - The dataset is split into training (70%) and testing (30%) sets

2. **Model Configuration**:
   - XGBRegressor with the following hyperparameters:
     - n_estimators: 300
     - learning_rate: 0.1
     - max_depth: 6
     - random_state: 42

3. **Feature Scaling**:
   - StandardScaler is applied to normalize the numerical features

4. **Model Evaluation**:
   - The model is evaluated using Mean Absolute Error (MAE) and R-squared metrics
   - The model achieves an R-squared of 0.88, indicating good predictive performance

## Model Persistence

The notebook saves the following artifacts for use in the prediction API:

1. **model.pkl**: The trained XGBoost model
2. **scaler.pkl**: The StandardScaler fitted on the training data
3. **label_encoder.pkl**: The label encoders for all categorical features

## Key Findings

- Car make, model, and year are the most important predictors of price
- Newer cars with lower mileage generally command higher prices
- Additional features like automatic transmission and air conditioning can increase car values
- There is significant price variation within makes and models

## Using the Model

The saved model artifacts are used by the FastAPI backend to make predictions based on user inputs from the frontend application. The prediction endpoint takes car features as input and returns an estimated price in Egyptian Pounds.

## Further Improvements

Potential improvements to the model include:
- Feature engineering to capture more nuanced relationships
- Ensemble methods combining multiple model types
- Hyperparameter tuning for better performance
- Incorporating more features like engine size, fuel type, etc. 