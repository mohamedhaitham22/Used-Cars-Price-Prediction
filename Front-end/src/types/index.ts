export interface CarFeatures {
  Maker: string;
  Model: string;
  Color: string;
  Automatic_Transmission: string;
  Air_Conditioner: string;
  Power_Steering: string;
  Remote_Control: string;
  KM: number;
  year: number;
}

export interface Prediction {
  input: {
    Maker: string;
    Model: string;
    Color: string;
    Automatic_Transmission: string;
    Air_Conditioner: string;
    Power_Steering: string;
    Remote_Control: string;
    KM: number;
    year: number;
  };
  predicted_price: number;
}