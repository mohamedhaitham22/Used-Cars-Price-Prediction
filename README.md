# Egyptian Used Cars Price Prediction

A machine learning-based web application that predicts the prices of used cars in Egypt based on various features such as make, model, year, kilometers driven, and additional features.

## Project Overview

This project aims to predict the prices of used cars in the Egyptian market using machine learning techniques. It consists of three main components:

1. **Data Analysis & Model Training** - Jupyter notebook with data exploration, preprocessing, and model training
2. **Backend API** - A FastAPI server that serves predictions using the trained model
3. **Frontend Application** - A React TypeScript application with a user-friendly interface for entering car details and displaying price predictions

## Project Structure

```
.
├── Back-end/                # Backend API server
│   ├── app.py                # FastAPI application
│   ├── create_encoders.py    # Utility for creating label encoders
│   └── models/               # Trained models and encoders
│       ├── label_encoder.pkl # Label encoders for categorical features
│       ├── model.pkl         # Trained prediction model
│       └── scaler.pkl        # Feature scaler
│
├── Front-end/               # React TypeScript frontend
│   ├── src/                  # Source code
│   │   ├── components/       # UI components
│   │   ├── context/          # React context providers
│   │   ├── data/             # Static data for UI
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   └── ... (configuration files)
│
└── Notebooks/               # Jupyter notebooks
    └── egyptian-used-car-price-prediction.ipynb  # Data analysis and model training
```

## Features

- **Car Details Input**: Users can input various car details such as make, model, color, year, mileage, and additional features like automatic transmission, air conditioning, etc.
- **Real-time Validation**: Form validation ensures accurate data entry
- **Price Prediction**: The application predicts the car's price in Egyptian Pounds (EGP) based on the input features
- **Responsive Design**: The application works well on various device sizes

## Technologies Used

### Backend
- **Python**: Core programming language
- **FastAPI**: API framework for serving predictions
- **Scikit-learn**: For preprocessing and model training
- **Joblib**: For model persistence

### Frontend
- **React**: JavaScript library for building the user interface
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling the application
- **Vite**: Build tool for the frontend

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the Back-end directory:
   ```
   cd Back-end
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   python app.py
   ```

The backend server will be running at http://localhost:8000.

### Frontend Setup

1. Navigate to the Front-end directory:
   ```
   cd Front-end
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend application will be running at http://localhost:5173.

## Usage

1. Open the application in your web browser at http://localhost:5173
2. Fill in the car details in the form
3. Submit the form to get a price prediction
4. View the predicted price in Egyptian Pounds (EGP)

## Model Details

The price prediction model was trained on a dataset of Egyptian used car listings. The model takes into account various features:

- Car make and model
- Car color
- Manufacturing year
- Kilometers driven
- Additional features (automatic transmission, air conditioning, power steering, remote control)

## Future Improvements

- Additional car makes and models
- More detailed feature inputs (engine size, fuel type, etc.)
- User authentication for saving predictions
- Historical price data visualization
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dataset sourced from used car listings in Egypt
- Built with modern web technologies and machine learning techniques 