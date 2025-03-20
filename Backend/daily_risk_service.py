from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date


class WeatherData(BaseModel):
    TMAX: float
    TMIN: float
   

CROP_TEMPERATURES = {
    "Cotton": {
        "TMaxOptimum": 32.0,
        "TMaxLimit": 38.0,
        "TMinOptimum": 20.0,
        "TMinLimit": 25.0,
        "TMinNoFrost": 4.0,
        "TMinFrost": -3.0
    },
    "Rice": {
        "TMaxOptimum": 32.0,
        "TMaxLimit": 38.0,
        "TMinOptimum": 22.0,
        "TMinLimit": 28.0,
        "TMinNoFrost": 5.0,
        "TMinFrost": -4.0
    },
    "Wheat": {
        "TMaxOptimum": 25.0,
        "TMaxLimit": 32.0,
        "TMinOptimum": 15.0,
        "TMinLimit": 20.0,
        "TMinNoFrost": 0.0,
        "TMinFrost": -5.0
    },   
}



def calculate_heat_stress(weather_data: WeatherData, crop_type: str):

    crop_temps = CROP_TEMPERATURES.get(crop_type, {})

    # Calculate diurnal heat stress
    S_heat = 0
    if weather_data.TMAX <= crop_temps["TMaxOptimum"]:
        S_heat = 0
    elif crop_temps["TMaxOptimum"] < weather_data.TMAX < crop_temps["TMaxLimit"]:
        S_heat = 9 * (weather_data.TMAX - crop_temps["TMaxOptimum"]) / (crop_temps["TMaxLimit"] - crop_temps["TMaxOptimum"])
    elif weather_data.TMAX >= crop_temps["TMaxLimit"]:
        S_heat = 9

    if(S_heat > 9):
        S_heat = 9

    
    # Calculate night stress
    S_night = 0
    if weather_data.TMIN < crop_temps["TMinOptimum"]:
        S_night = 0
    elif crop_temps["TMinOptimum"] <= weather_data.TMIN < crop_temps["TMinLimit"]:
        S_night = 9 * (weather_data.TMIN - crop_temps["TMinOptimum"]) / (crop_temps["TMinLimit"] - crop_temps["TMinOptimum"])
    elif weather_data.TMIN >= crop_temps["TMinLimit"]:
        S_night = 9

    if(S_night > 9):
        S_night = 9

    S_frost = calculate_frost_stress(weather_data, crop_temps)
    
    if(S_frost > 9):
        S_frost = 9

    return S_heat, S_night, S_frost

def calculate_frost_stress(weather_data: WeatherData, crop_temps: dict):
    S_frost = 0
    if weather_data.TMIN >= crop_temps["TMinNoFrost"]:
        S_frost = 0
    elif weather_data.TMIN < crop_temps["TMinNoFrost"]:
        S_frost = 9 * abs(weather_data.TMIN - crop_temps["TMinNoFrost"]) / abs(crop_temps["TMinFrost"] - crop_temps["TMinNoFrost"])
    elif weather_data.TMIN <= crop_temps["TMinFrost"]:
        S_frost = 9
    return S_frost



