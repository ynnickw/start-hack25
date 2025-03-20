import requests

# Function to get daily max and min temperatures


def get_daily_temperatures(api_key, latitude, longitude, start_date, end_date):


    api_key = "d4f087c7-7efc-41b4-9292-0f22b6199215"
    url = "https://services.cehub.syngenta-ais.com/api/Forecast/ShortRangeForecastDaily"
    headers = {
        "Accept": "application/json, text/plain, */*",
        "ApiKey": api_key
    }
    params = {
        "format": "json",
        "supplier": "Meteoblue",
        "startDate": start_date,
        "endDate": end_date,
        "measureLabel": "TempAir_DailyMax (C);TempAir_DailyMin (C)",
        "latitude": latitude,
        "longitude": longitude
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_historical_daily_temperatures(api_key, latitude, longitude, start_date, end_date, location):
    if not location:
        location = ""
    url = "http://my.meteoblue.com/dataset/query"
    headers = {
        "Content-Type": "application/json"
    }
    body = {
        "units": {
            "temperature": "C",
            "velocity": "km/h",
            "length": "metric",
            "energy": "watts"
        },
        "geometry": {
            "type": "MultiPoint",
            "coordinates": [[longitude, latitude]],
            "locationNames": [location],
            "mode": "preferLandWithMatchingElevation"
        },
        "format": "json",
        "timeIntervals": [f"{start_date}T+01:00/{end_date}T+01:00"],
        "timeIntervalsAlignment": "none",
        "queries": [
            {
                
                "domain": "ERA5T",
                "gapFillDomain": "NEMSGLOBAL",
                "timeResolution": "daily",
                "codes": [
                    # Temperature max
                    {
                        "code": 11,
                        "level": "2 m above gnd",
                        "aggregation": "max"
                    },
                    # Temperature min
                    {
                        "code": 11,
                        "level": "2 m above gnd",
                        "aggregation": "min"
                    },
                    # Precipitation
                    {
                        "code": 61,
                        "level": "sfc",
                        "aggregation": "sum"
                    },
                    # Relative humidity
                    {
                        "code": 52,
                        "level": "2 m above gnd",
                        "aggregation": "sum"
                    },
                    #Evaporization
                     {
                        "code": 261,
                        "level": "sfc",
                        "aggregation": "sum"
                    },
                    # Soil Moisture
                    {
                        "code": 144,
                        "level": "0-7 cm down",
                        "aggregation": "mean"
                    }

                ]

            },
            {
                "domain": "WISE30",
                "gapFillDomain": "NEMSGLOBAL",
                "timeResolution": "static",
                "codes": [
                #Nitrogen
                    {
                        "code": 817,
                        "level": "0-20 cm"
                    },
                    {
                        "code": 812,
                        "level": "0-20 cm"
                    }
                ]
            }
        ]
    }
    response = requests.post(url, headers=headers, json=body, params={"apikey": api_key})
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

if __name__ == "__main__":
    # Example parameters
    api_key = "7b29a207a0de"  # Historical Token from Postman
    latitude = 49.558399
    longitude = 77.57327
    start_date = "2023-08-01"
    end_date = "2023-08-31"
   
    try:
        # Call the function
        historical_data = get_historical_daily_temperatures(api_key, latitude, longitude, start_date, end_date, '')
        # Print the result
        print(historical_data)
    except Exception as e:
        print(f"An error occurred: {e}")
