from pydantic import BaseModel



class HistoricalWeatherData(BaseModel):
    #Cumulative rainfall (mm) over last growing season
    P_RAINFALL: float
    #Cumulative evapotranspiration (mm) over last growing season
    E_EVAPORATION: float
    #Cumulative soil moisture (mm) over last growing season
    SM_SOIL_MOISTURE: float
    #Average temperature (C) over last growing season
    AVG_TEMP: float
    #Actual pH of the soil
    ACTUAL_PH: float
    #Actual nitrogen content of the soil
    ACTUAL_N: float




WEIGHTING_FACTORS = {
    "w1": 0.3,
    "w2": 0.4,
    "w3": 0.3,
    "w4": 0.3
}

CROP_OPTIMALS = {
    "Cotton": {"GDD": 2400, "Precip": 1000, "pH": 6.25, "N": 0.026, "Yield_Min": 250000, "Yield_Max": 400000},
    "Rice": {"GDD": 2250, "Precip": 1250, "pH": 5.0, "N": 0.0715, "Yield_Min": 250000, "Yield_Max": 625000},
    "Wheat": {"GDD": 2250, "Precip": 1250, "pH": 5.0, "N": 0.077, "Yield_Min": 250000, "Yield_Max": 625000}
}


def calculate_drought_index(historical_data: HistoricalWeatherData):
    return (historical_data.P_RAINFALL - historical_data.E_EVAPORATION + historical_data.SM_SOIL_MOISTURE) / historical_data.AVG_TEMP

def calculate_yield_risk(historical_data: HistoricalWeatherData, crop_type: str):
    optimal_values = CROP_OPTIMALS.get(crop_type, {"GDD": 0, "Precip": 0, "pH": 0, "N": 0, "Yield_Min": 0, "Yield_Max": 0})
    # Optimal values for the crop
    optimal_gdd = optimal_values["GDD"]
    optimal_precip = optimal_values["Precip"]
    optimal_ph = optimal_values["pH"]
    optimal_n = optimal_values["N"]

    # Actual values for the crop
    #actual_gdd = historical_data.GDD
    actual_precip = historical_data.P_RAINFALL
    actual_ph = historical_data.ACTUAL_PH
    actual_n = historical_data.ACTUAL_N

    print('actual_precip: ', actual_precip)
    print('optimal_precip: ', optimal_precip)
    print('actual_ph: ', actual_ph)
    print('optimal_ph: ', optimal_ph)
    print('actual_n: ', actual_n)
    print('optimal_n: ', optimal_n)

    YR =  (WEIGHTING_FACTORS["w2"] * (actual_precip - optimal_precip) ** 2 +
          WEIGHTING_FACTORS["w3"] * (actual_ph - optimal_ph) ** 2 +
          WEIGHTING_FACTORS["w4"] * (actual_n - optimal_n) ** 2)
    print('YR: ', YR)
    normalized_risk = (YR - optimal_values["Yield_Min"]) / (optimal_values["Yield_Max"] - optimal_values["Yield_Min"]) * 100
    normalized_risk = min(max(normalized_risk, 0), 100)  # ensures between 0% and 100%


    return normalized_risk

def calculate_drought_risk_adjusted(historical_data: HistoricalWeatherData):
    drought_index = historical_data.SM_SOIL_MOISTURE
    if(drought_index < 0.1):
        return 0.9
    elif(drought_index < 0.2):
        return 0.6
    else:
        return 0
    


