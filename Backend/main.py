from weather_data_to_dataframe import create_weather_dataframe
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date
from whole_risk_service import calculate_monthly_risk, calculate_periodly_risk, FarmerInput
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(root_path="/default")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/calculate-risk")
def calculate_risk(farmer_input: FarmerInput):
    
    weather_df = create_weather_dataframe(farmer_input.latitude, farmer_input.longitude, farmer_input.planting_date, farmer_input.harvest_date, farmer_input.location)

    monthly_risk = calculate_monthly_risk(weather_df, farmer_input)
    periodly_risk = calculate_periodly_risk(weather_df, farmer_input)
    

    stress_buster_recommended = any(
        value > 0.5
        for risk_factor in monthly_risk.values()
        for value in risk_factor.values()
    )

    yield_booster_recommended = any(
        value > 0.2
        for value in periodly_risk.values()
    )

    return {
        "stress_buster_recommended": stress_buster_recommended,
        "yield_booster_recommended": yield_booster_recommended,
        "risk_factors": {**monthly_risk, **periodly_risk}
    }

# Add Lambda handler
handler = Mangum(app) 