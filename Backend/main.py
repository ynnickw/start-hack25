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
    growing_season: str
    

# Weather Data over growing season
class WeatherData(BaseModel):
    TMAX: float
    TMIN: float
    PRECIP: float
    HUMIDITY: float
    WIND_SPEED: float
    EVAPOTRANSPIRATION: float

# Historical Weather Data over growing season
class HistoricalWeatherData(BaseModel):
    #Cumulative rainfall (mm) over last growing season
    P_RAINFALL: float
    #Cumulative evapotranspiration (mm) over last growing season
    E_EVAPORATION: float
    #Cumulative soil moisture (mm) over last growing season
    SM_SOIL_MOISTURE: float
    #Average temperature (C) over last growing season
    AVG_TEMP: float
    GDD: float
    ACTUAL_PH: float
    ACTUAL_N: float
    RAINFALL_HISTORY: float
    FROST_OCCURRENCES: int

# Define optimal and limit temperatures for each crop type
CROP_TEMPERATURES = {
    "Cotton": {
        "TMaxOptimum": 32.0,
        "TMaxLimit": 38.0,
        "TMinOptimum": 20.0,
        "TMinLimit": 25.0,
        "TMinNoFrost": 4.0,
        "TminFrost": 5.0
    },
    "Rice": {
        "TMaxOptimum": 32.0,
        "TMaxLimit": 38.0,
        "TMinOptimum": 22.0,
        "TMinLimit": 28.0,
        "TMinNoFrost": None,
        "TminFrost": None
    },
    "Wheat": {
        "TMaxOptimum": 25.0,
        "TMaxLimit": 32.0,
        "TMinOptimum": 15.0,
        "TMinLimit": 20.0,
        "TMinNoFrost": None,
        "TminFrost": None
    },
    # Add other crops with their respective temperature values
}

# Define optimal GDD and precipitation for each crop type
CROP_OPTIMALS = {
    "Cotton": {"GDD": 2400, "Precip": 1000, "pH": 6.25, "N": 0.026},
    "Rice": {"GDD": 2250, "Precip": 1250, "pH": 5.0, "N": 0.0715},
    "Wheat": {"GDD": 2250, "Precip": 1250, "pH": 5.0, "N": 0.077}
}

# Define weighting factors for yield risk calculation
WEIGHTING_FACTORS = {
    "w1": 0.3,
    "w2": 0.3,
    "w3": 0.2,
    "w4": 0.2
}

def calculate_heat_stress(weather_data: WeatherData, crop_temps: dict):
    # Calculate diurnal heat stress
    S_heat = 0
    if weather_data.TMAX <= crop_temps["TMaxOptimum"]:
        S_heat = 0
    elif crop_temps["TMaxOptimum"] < weather_data.TMAX < crop_temps["TMaxLimit"]:
        S_heat = 9 * (weather_data.TMAX - crop_temps["TMaxOptimum"]) / (crop_temps["TMaxLimit"] - crop_temps["TMaxOptimum"])
    elif weather_data.TMAX >= crop_temps["TMaxLimit"]:
        S_heat = 9


    
    # Calculate night stress
    S_night = 0
    if weather_data.TMIN < crop_temps["TMinOptimum"]:
        S_night = 0
    elif crop_temps["TMinOptimum"] <= weather_data.TMIN < crop_temps["TMinLimit"]:
        S_night = 9 * (weather_data.TMIN - crop_temps["TMinOptimum"]) / (crop_temps["TMinLimit"] - crop_temps["TMinOptimum"])
    elif weather_data.TMIN >= crop_temps["TMinLimit"]:
        S_night = 9

    return S_heat, S_night

def calculate_frost_stress(weather_data: WeatherData, crop_temps: dict):
    S_frost = 0
    if weather_data.TMIN >= crop_temps["TMinNoFrost"]:
        S_frost = 0
    elif weather_data.TMIN < crop_temps["TMinNoFrost"]:
        S_frost = 9 * abs(weather_data.TMIN - crop_temps["TMinNoFrost"]) / abs(crop_temps["TminFrost"] - crop_temps["TMinNoFrost"])
    elif weather_data.TMIN <= crop_temps["TminFrost"]:
        S_frost = 9
    return S_frost

def calculate_yield_risk(historical_data: HistoricalWeatherData, weather_data: WeatherData, optimal_values: dict):
    # Optimal values for the crop
    optimal_gdd = optimal_values["GDD"]
    optimal_precip = optimal_values["Precip"]
    optimal_ph = optimal_values["pH"]
    optimal_n = optimal_values["N"]

    # Actual values for the crop
    actual_gdd = historical_data.GDD
    actual_precip = weather_data.PRECIP
    actual_ph = historical_data.ACTUAL_PH
    actual_n = historical_data.ACTUAL_N

    YR = (WEIGHTING_FACTORS["w1"] * (historical_data.GDD - optimal_gdd) ** 2 +
          WEIGHTING_FACTORS["w2"] * (weather_data.PRECIP - optimal_precip) ** 2 +
          WEIGHTING_FACTORS["w3"] * (actual_ph - optimal_ph) ** 2 +
          WEIGHTING_FACTORS["w4"] * (actual_n - optimal_n) ** 2)
    return YR

@app.post("/calculate_risk")
async def calculate_risk(farmer_input: FarmerInput, weather_data: WeatherData, historical_data: HistoricalWeatherData):
    crop_temps = CROP_TEMPERATURES.get(farmer_input.crop_type, {})
    if not crop_temps:
        raise HTTPException(status_code=400, detail="Unsupported crop type")

    # Calculate days since planting
    days_since_planting = (date.today() - farmer_input.planting_date).days
    # Use days_since_planting in risk calculations if needed

    # Abiotic Stress Risk Calculations
    S_heat, S_night = calculate_heat_stress(weather_data, crop_temps)

    # Frost Stress Calculation
    S_frost = calculate_frost_stress(weather_data, crop_temps)

    # Drought Index Calculation
    DI = (historical_data.P_RAINFALL - historical_data.E_EVAPORATION) + historical_data.SM_SOIL_MOISTURE / historical_data.AVG_TEMP

    # Yield Risk Calculation
    optimal_values = CROP_OPTIMALS.get(farmer_input.crop_type, {"GDD": 0, "Precip": 0, "pH": 0, "N": 0})
    YR = calculate_yield_risk(historical_data, weather_data, optimal_values)

    # Decision Making
    stress_buster_recommended = any([S_heat >= 5, S_night >= 5, S_frost >= 5, DI <= 1])
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