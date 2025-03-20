from weather_data_to_dataframe import create_weather_dataframe
import pandas as pd
from extract_weather_data import extract_weather_data_for_day
from daily_risk_service import calculate_heat_stress, calculate_frost_stress
from main import FarmerInput
from datetime import date


def power_mean(series, p=3):
    return ((series.pow(p).mean()) ** (1 / p))/9


#good for heat
#latitude=47.558399,  # Example latitude
#longitude=7.57327,   # Example longitude

# Create a FarmerInput instance (you need to provide the necessary data)
farmer_input = FarmerInput(
    latitude=55.558399,  # Example latitude
    longitude=37.57327,   # Example longitude
    crop_type="Wheat",   # Example crop type
    crop_stage="Growth", # Example crop stage
    planting_date=date(2023, 1, 1),  # Example planting date
    growing_season="Spring"  # Example growing season
)

# Call the function to create the DataFrame
weather_df = create_weather_dataframe()
print('weather_df: ', weather_df)

# Create a list to store the results
results = []


# Iterate over each day in the dataframe
for date_str in weather_df.index:
    # Extract weather data for the specific day
    weather_data, historical_weather_data = extract_weather_data_for_day(date_str)
    print('weather_data: ', weather_data)
    print('historical_weather_data: ', historical_weather_data)
    
    # Call the risk calculation function
    risk_result = calculate_heat_stress(weather_data, farmer_input.crop_type)

    print('Risk Result: ', risk_result)
    
    # Append the result to the list
    results.append((date_str, *risk_result))

# Convert the results list to a DataFrame
risk_df = pd.DataFrame(results, columns=[ "DATE", "S_heat", "S_night", "S_frost"])




risk_df.set_index('DATE', inplace=True)

risk_factors = risk_df.groupby(risk_df.index.to_period("M")).apply(lambda df: df.apply(lambda col: power_mean(col, p=3)))


# Print the new DataFrame
print('risk_df: ', risk_df)

power_mean_series = risk_df.copy().apply(lambda col: power_mean(col, p=3))


print('power_mean_series: ', power_mean_series.to_json())

print('risk_factors: ', risk_factors.to_json())





