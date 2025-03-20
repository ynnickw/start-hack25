from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date

app = FastAPI()

class FarmerInput(BaseModel):
    latitude: float
    longitude: float
    crop_type: str
    crop_stage: str
    historical_yield: Optional[float] = None
    planting_date: date
    

class WeatherData(BaseModel):
    TMAX: float
    TMIN: float
    PRECIP: float
    HUMIDITY: float
    WIND_SPEED: float
    EVAPOTRANSPIRATION: float

class HistoricalWeatherData(BaseModel):
    GDD: float
    RAINFALL_HISTORY: float
    FROST_OCCURRENCES: int

# Define optimal and limit temperatures for each crop type
CROP_TEMPERATURES = {
    "Cotton": {
        "TMaxOptimum": 35.0,
        "TMaxLimit": 45.0,
        "TMinOptimum": 25.0,
        "TMinLimit": 15.0,
        "TMinNoFrost": 10.0,
        "TminFrost": 5.0
    },
    "Rice": {
        "TMaxOptimum": 32.0,
        "TMaxLimit": 42.0,
        "TMinOptimum": 22.0,
        "TMinLimit": 12.0,
        "TMinNoFrost": 7.0,
        "TminFrost": 2.0
    },
    "Wheat": {
        "TMaxOptimum": 25.0,
        "TMaxLimit": 35.0,
        "TMinOptimum": 15.0,
        "TMinLimit": 5.0,
        "TMinNoFrost": 0.0,
        "TminFrost": -5.0
    },
    # Add other crops with their respective temperature values
}

# Define weighting factors for yield risk calculation
WEIGHTING_FACTORS = {
    "w1": 0.25,
    "w2": 0.25,
    "w3": 0.25,
    "w4": 0.25
}

def calculate_heat_stress(TMAX, TMaxOptimum, TMaxLimit):
    

@app.post("/calculate_risk")
async def calculate_risk(farmer_input: FarmerInput, weather_data: WeatherData, historical_data: HistoricalWeatherData):
    crop_temps = CROP_TEMPERATURES.get(farmer_input.crop_type, {})
    if not crop_temps:
        raise HTTPException(status_code=400, detail="Unsupported crop type")

    # Calculate days since planting
    days_since_planting = (date.today() - farmer_input.planting_date).days
    # Use days_since_planting in risk calculations if needed

    # Abiotic Stress Risk Calculations
    S_heat = 9 * (weather_data.TMAX - crop_temps["TMaxOptimum"]) / (crop_temps["TMaxLimit"] - crop_temps["TMaxOptimum"])
    S_night = 9 * (weather_data.TMIN - crop_temps["TMinOptimum"]) / (crop_temps["TMinLimit"] - crop_temps["TMinOptimum"])
    S_frost = 0
    if weather_data.TMIN <= 4:
        S_frost = 9 * abs(weather_data.TMIN - crop_temps["TMinNoFrost"]) / abs(crop_temps["TminFrost"] - crop_temps["TMinNoFrost"])
    DI = (weather_data.PRECIP - weather_data.EVAPOTRANSPIRATION) + weather_data.TMAX

    # Yield Risk Calculation
    YR = (WEIGHTING_FACTORS["w1"] * (historical_data.GDD - 1000) ** 2 +
          WEIGHTING_FACTORS["w2"] * (weather_data.PRECIP - 500) ** 2 +
          WEIGHTING_FACTORS["w3"] * (weather_data.TMAX - crop_temps["TMaxOptimum"]) ** 2 +
          WEIGHTING_FACTORS["w4"] * (weather_data.TMIN - crop_temps["TMinOptimum"]) ** 2)

    # Decision Making
    stress_buster_recommended = any([S_heat >= 5, S_night >= 5, S_frost >= 5, DI >= 5])
    yield_booster_recommended = YR > 10  # Example threshold

    return {
        "location": {
            "latitude": farmer_input.latitude,
            "longitude": farmer_input.longitude
        },
        "crop": farmer_input.crop_type,
        "growth_stage": farmer_input.crop_stage,
        "stress_buster_recommended": stress_buster_recommended,
        "yield_booster_recommended": yield_booster_recommended,
        "risk_factors": {
            "heat_stress": S_heat,
            "night_stress": S_night,
            "frost_stress": S_frost,
            "drought_index": DI,
            "yield_risk": YR
        }
    } 