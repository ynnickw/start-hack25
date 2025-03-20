import pandas as pd

from weather_data import get_historical_daily_temperatures

def create_weather_dataframe():


    # Sample data good for heat test
    #sample_data = get_historical_daily_temperatures(api_key = "7b29a207a0de",  # Historical Token from Postman
    #latitude = 49.558399,
    #longitude = 77.57327,
    #start_date = "2023-08-01",
    #end_date = "2023-08-31", location="")

    sample_data = get_historical_daily_temperatures(api_key = "7b29a207a0de",  # Historical Token from Postman
    latitude = 55.558399,
    longitude = 37.57327,
    start_date = "2023-08-01",
    end_date = "2023-12-31", location="")

    # Extract time intervals
    intervals = sample_data[0]['timeIntervals'][0]

    # Initialize a dictionary to hold the data
    weather_dict = {"TimeInterval": intervals}

    # Process each code
    for code in sample_data[0]['codes']:
        variable = f"{code['variable']}_{code['aggregation']}"
        data = code['dataPerTimeInterval'][0]['data'][0]
        weather_dict[variable] = data

    # Process static data (e.g., nitrogen)
    static_data = sample_data[1]['codes'][0]['dataPerTimeInterval'][0]['data'][0][0]
    static_variable = f"Nitrogen"
    weather_dict[static_variable] = [static_data] * len(intervals)

    # Create DataFrame
    weather_df = pd.DataFrame(weather_dict)
    weather_df.set_index('TimeInterval', inplace=True)
    weather_df.index = pd.to_datetime(weather_df.index.str[:8], format="%Y%m%d")

    return weather_df

# Call the function and print the DataFrame
weather_df = create_weather_dataframe()
print(weather_df) 