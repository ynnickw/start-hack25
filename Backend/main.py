from weather_data_to_dataframe import create_weather_dataframe
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date
from whole_risk_service import calculate_monthly_risk, calculate_periodly_risk, FarmerInput

app = FastAPI()



@app.post("/calculate-risk")
def calculate_risk(farmer_input: FarmerInput):
    
    weather_df = create_weather_dataframe(farmer_input.latitude, farmer_input.longitude, farmer_input.planting_date, farmer_input.harvest_date, farmer_input.location)

    monthly_risk = calculate_monthly_risk(weather_df, farmer_input)
    periodly_risk = calculate_periodly_risk(weather_df, farmer_input)
    

    # Decision Making
    #stress_buster_recommended = any([S_heat >= 5, S_night >= 5, S_frost >= 5, DI <= 1])
    #yield_booster_recommended = YR > 10  # Example threshold

    return {
        "stress_buster_recommended": 'true',
        "yield_booster_recommended": 'false',
        "risk_factors": {
           monthly_risk,
           periodly_risk
        }
    } 