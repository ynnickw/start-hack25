# Abiotic Stress and Yield Risk Assessment Backend

## Overview

This project is a Python-based backend developed using FastAPI. It calculates abiotic stress risk and yield risk for various crops based on real-time weather conditions and historical data. The backend provides recommendations for using Stress Buster or Yield Booster products based on calculated risks.

## Features

- **Risk Calculations**: Computes abiotic stress and yield risk for crops like Soybean, Cotton, Rice, and Wheat.
- **REST API Endpoints**:
  - `/calculate_risk` (POST): Accepts farmer and weather data, returns risk scores and recommendations.
  - `/get_weather` (GET): Fetches the latest weather data for a given location (to be implemented).
  - `/get_historical` (GET): Fetches past yield/weather trends (to be implemented).

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd start-hack25/Backend
   ```

2. **Create and Activate Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install fastapi uvicorn requests
   ```

## Running the Application

1. **Start the FastAPI Application**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access the API**:
   - Open your browser or use a tool like Postman to access `http://0.0.0.0:8000/docs` for the interactive API documentation.

## Example Request

To test the `/calculate_risk` endpoint, you can use the following `curl` command:

```bash
curl -X POST "http://0.0.0.0:8000/calculate_risk" \
-H "Content-Type: application/json" \
-d '{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "crop_type": "Soybean",
  "crop_stage": "Flowering",
  "historical_yield": 3.5,
  "planting_date": "2023-04-01",
  "weather_data": {
    "TMAX": 35.0,
    "TMIN": 20.0,
    "PRECIP": 10.0,
    "HUMIDITY": 60.0,
    "WIND_SPEED": 5.0,
    "EVAPOTRANSPIRATION": 5.0
  },
  "historical_data": {
    "GDD": 1200,
    "RAINFALL_HISTORY": 300,
    "FROST_OCCURRENCES": 2
  }
}'
```

## Future Enhancements

- Implement `/get_weather` and `/get_historical` endpoints.
- Integrate with external APIs for real-time and historical data. 