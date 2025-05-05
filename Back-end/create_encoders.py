from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Create encoders for each categorical feature
encoders = {
    'Maker': LabelEncoder(),
    'Model': LabelEncoder(),
    'Color': LabelEncoder(),
    'Automatic_Transmission': LabelEncoder(),
    'Air_Conditioner': LabelEncoder(),
    'Power_Steering': LabelEncoder(),
    'Remote_Control': LabelEncoder()
}

# Define the supported car makers and models that the model was trained on
makers = ['BMW', 'Chevrolet', 'Honda', 'Hyundai', 'Kia', 'Mercedes', 'Mitsubishi', 'Nissan', 'Suzuki', 'Toyota']

models = [
    # BMW
    '3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'M3',
    # Chevrolet
    'Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Suburban', 'Camaro',
    # Honda
    'Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V',
    # Hyundai
    'Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona', 'Palisade', 'Accent',
    # Kia
    'Forte', 'Sportage', 'Sorento', 'Telluride', 'Optima', 'Soul', 'Seltos',
    # Mercedes
    'C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'GLA',
    # Mitsubishi
    'Outlander', 'Eclipse Cross', 'Mirage', 'Outlander PHEV', 'Outlander Sport', 'Lancer',
    # Nissan
    'Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Murano', 'Frontier', 'Maxima',
    # Suzuki
    'Swift', 'Vitara', 'SX4', 'Jimny', 'Grand Vitara',
    # Toyota
    'Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander', 'Tacoma', 'Land Cruiser'
]

# Fit each encoder with the proper values
encoders['Maker'].fit(makers)
encoders['Model'].fit(models)
encoders['Color'].fit(['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue'])
encoders['Automatic_Transmission'].fit(['Yes', 'No'])
encoders['Air_Conditioner'].fit(['Yes', 'No'])
encoders['Power_Steering'].fit(['Yes', 'No'])
encoders['Remote_Control'].fit(['Yes', 'No'])

# Create Models directory if it doesn't exist
os.makedirs('Models', exist_ok=True)

# Save the encoders
joblib.dump(encoders, os.path.join('Models', 'label_encoder.pkl'))
print("Label encoders created and saved successfully!") 