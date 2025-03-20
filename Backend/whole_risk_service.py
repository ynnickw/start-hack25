from weather_data_to_dataframe import create_weather_dataframe
import pandas as pd
from extract_weather_data import extract_weather_data_for_day
from daily_risk_service import calculate_heat_stress, calculate_frost_stress
from main import FarmerInput
from periodly_risk_service import calculate_drought_index, HistoricalWeatherData, calculate_drought_risk_adjusted, calculate_yield_risk
from datetime import date
import json  # Add this import at the top of your file



def power_mean(series, p=3):
    return ((series.pow(p).mean()) ** (1 / p))/9


#good for heat
#latitude=47.558399,  # Example latitude
#longitude=7.57327,   # Example longitude

# Create a FarmerInput instance (you need to provide the necessary data)
farmer_input = FarmerInput(
    latitude=38.558399,  # Example latitude
    longitude=-98.57327,   # Example longitude
    crop_type="Rice",   # Example crop type
    crop_stage="Growth", # Example crop stage
    planting_date=date(2023, 1, 1),  # Example planting date
    growing_season="Spring"  # Example growing season
)
weather_df = create_weather_dataframe()


def calculate_monthly_risk(farmer_input: FarmerInput):
    # Call the function to create the DataFrame
   
    print('weather_df: ', weather_df)

    # Create a list to store the results
    results = []


    # Iterate over each day in the dataframe
    for date_str in weather_df.index:
        # Extract weather data for the specific day
        weather_data, historical_weather_data = extract_weather_data_for_day(date_str)
       

        # Call the risk calculation function
        risk_result = calculate_heat_stress(weather_data, farmer_input.crop_type)

      

        # Append the result to the list
        results.append((date_str, *risk_result))

    # Convert the results list to a DataFrame
    risk_df = pd.DataFrame(results, columns=[ "DATE", "S_heat", "S_night", "S_frost"])




    risk_df.set_index('DATE', inplace=True)

    risk_factors = risk_df.groupby(risk_df.index.to_period("M")).apply(lambda df: df.apply(lambda col: power_mean(col, p=3)))


    # Print the new DataFrame
    print('risk_df: ', risk_df)

    power_mean_series = risk_df.copy().apply(lambda col: power_mean(col, p=3))


    return {"risk_factors": json.loads(risk_factors.to_json())}
    



def calculate_periodly_risk(farmer_input: FarmerInput):
    historical_weather_data = HistoricalWeatherData(
        P_RAINFALL=weather_df['Precipitation Total_sum'].sum(),
        E_EVAPORATION=weather_df['Evapotranspiration_sum'].sum(),
        SM_SOIL_MOISTURE=weather_df['Soil Moisture_mean'].mean(),
        AVG_TEMP=weather_df['Temperature_max'].mean(),
        ACTUAL_PH=weather_df['pH in H2O'].mean(),
        ACTUAL_N=weather_df['Total Nitrogen Content'].mean()
    )
    print('historical_weather_data: ', historical_weather_data)
    drough_risk = calculate_drought_risk_adjusted(historical_weather_data)
    yield_risk = calculate_yield_risk(historical_weather_data, farmer_input.crop_type)
    return {"drought_risk": drough_risk, "yield_risk": yield_risk}



print(calculate_monthly_risk(farmer_input))

print(calculate_periodly_risk(farmer_input))



