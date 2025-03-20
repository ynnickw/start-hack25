import pandas as pd
from datetime import datetime
from pydantic import BaseModel


class WeatherData(BaseModel):
    TMAX: float
    TMIN: float
    PRECIP: float
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


# Function to extract weather data for a specific day
def extract_weather_data_for_day(date_str, weather_df):
   # print(date_str)
    # Convert the date string to a datetime object
    #date_obj = datetime.strptime(date_str, '%Y%m%dT%H%M')
    

    # Format the datetime object to match the DataFrame index
    #formatted_date = date_obj.strftime('%Y%m%dT%H%M')
    #print(formatted_date)
    # Extract the data for the specific day
    day_data = weather_df.loc[date_str]



    
    # Create WeatherData instance
    weather_data = WeatherData(
        TMAX=day_data['Temperature_max'],
        TMIN=day_data['Temperature_min'],
        PRECIP=day_data['Precipitation Total_sum'],
        EVAPOTRANSPIRATION=day_data['Evapotranspiration_sum'],
    )
    
    # Create HistoricalWeatherData instance
    historical_weather_data = HistoricalWeatherData(
        P_RAINFALL=day_data['Precipitation Total_sum'],
        E_EVAPORATION=day_data['Evapotranspiration_sum'],
        SM_SOIL_MOISTURE=day_data['Soil Moisture_mean'],
        AVG_TEMP=(day_data['Temperature_max'] + day_data['Temperature_min']) / 2,
        GDD=0,  # Placeholder, calculate if needed
        ACTUAL_PH=0,  # Placeholder, replace with actual data if available
        ACTUAL_N=day_data['Total Nitrogen Content'],
        RAINFALL_HISTORY=0,  # Placeholder, replace with actual data if available
        FROST_OCCURRENCES=0  # Placeholder, calculate if needed
    )
    
    return weather_data, historical_weather_data

# Example usage
if __name__ == "__main__":
    date_to_extract = '20230101T0000'
    weather_data, historical_weather_data = extract_weather_data_for_day(date_to_extract)
    print(weather_data)
    print(historical_weather_data) 