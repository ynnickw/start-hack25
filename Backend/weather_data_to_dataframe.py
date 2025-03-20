import pandas as pd

# Sample data
sample_data = [
    {'codes': [{'aggregation': 'max', 'dataPerTimeInterval': [{'data': [[16.68, 13.95, 9.42, 10.31, 11.86, 9.95, 10.54, 8.5, 8.5, 6.97, 9.34, 10.05, 10.17, 10.39, 11.69, 6.28, 2.84, 1.71, 1.27, 1.44, 0.52, 1.19, 2.91, 4.49, 3.05, 1.33, 0.92, 2.37, 2, 2.68, 4.6]], 'gapFillRatio': 0}], 'unit': '°C', 'level': '2 m above gnd', 'code': 11, 'variable': 'Temperature'}, {'aggregation': 'min', 'dataPerTimeInterval': [{'data': [[8.34, 6.87, 2.6, 3.95, 7.73, 6.31, 4.38, 3.6, 4.3, 4.23, 6.89, 6.83, 6.71, 5.77, 3.72, 3.04, 0.24, -0.95, -4.26, -4.15, -5.07, -1.28, -0.15, 2.04, 1.73, -1.28, -1.64, -0.66, -3.28, -3.69, -0.98]], 'gapFillRatio': 0}], 'unit': '°C', 'level': '2 m above gnd', 'code': 11, 'variable': 'Temperature'}, {'aggregation': 'sum', 'dataPerTimeInterval': [{'data': [[0, 2.5000002, 0, 0.6, 1.0000001, 0.4, 0, 8.500001, 6.8, 2.2, 2.3999999, 0, 2.1, 4.3999996, 10.3, 1.8000002, 5.4999995, 1.8000003, 0, 0.1, 0, 1.1000001, 0, 0, 0, 0, 0, 0, 0, 1, 0.3]], 'gapFillRatio': 0}], 'unit': 'mm', 'level': 'sfc', 'code': 61, 'variable': 'Precipitation Total'}, {'aggregation': 'sum', 'dataPerTimeInterval': [{'data': [[1915.7847, 1948.9592, 2272.6497, 2061.598, 2192.6824, 2165.5645, 2144.0532, 2229.1926, 2027.007, 1875.4017, 2020.9583, 1784.6875, 1890.717, 1797.3628, 1873.1908, 1715.8818, 2249.0686, 2162.4822, 2060.06, 1970.4679, 1950.8754, 2058.43, 1888.6482, 1915.6401, 2053.7114, 2042.843, 1998.8413, 1917.822, 1868.585, 2044.8969, 2079.3367]], 'gapFillRatio': 0}], 'unit': '%', 'level': '2 m above gnd', 'code': 52, 'variable': 'Relative Humidity'}, {'aggregation': 'sum', 'dataPerTimeInterval': [{'data': [[0.51119995, 0.55728, 0.45792, 0.65519994, 0.76176, 0.39456, 0.38592002, 0.61775994, 1.1736, 1.04976, 0.6595201, 0.8135998, 1.26288, 1.188, 1.7568, 1.2196798, 0.29520002, 0.47808, 0.42912, 0.38015997, 0.33696, 0.38447994, 0.42911997, 0.38159996, 0.34848, 0.3384, 0.39456, 0.42048004, 0.41759995, 0.32687998, 0.52415997]], 'gapFillRatio': 0}], 'unit': 'mm', 'level': 'sfc', 'code': 261, 'variable': 'Evapotranspiration'}, {'aggregation': 'mean', 'dataPerTimeInterval': [{'data': [[0.38433325, 0.3849584, 0.39083335, 0.38062498, 0.3844166, 0.38074997, 0.37433338, 0.3965, 0.415125, 0.4110417, 0.4012916, 0.39420834, 0.39258334, 0.3910834, 0.419125, 0.40216675, 0.3987917, 0.39612505, 0.3865, 0.379125, 0.37462506, 0.37120828, 0.36820838, 0.3642083, 0.362125, 0.35925004, 0.35637495, 0.3540417, 0.3540417, 0.35395837, 0.35679165]], 'gapFillRatio': 0}], 'unit': 'm³/m³', 'level': '0-7 cm down', 'code': 144, 'variable': 'Soil Moisture'}], 'timeIntervals': [['20230101T0000', '20230102T0000', '20230103T0000', '20230104T0000', '20230105T0000', '20230106T0000', '20230107T0000', '20230108T0000', '20230109T0000', '20230110T0000', '20230111T0000', '20230112T0000', '20230113T0000', '20230114T0000', '20230115T0000', '20230116T0000', '20230117T0000', '20230118T0000', '20230119T0000', '20230120T0000', '20230121T0000', '20230122T0000', '20230123T0000', '20230124T0000', '20230125T0000', '20230126T0000', '20230127T0000', '20230128T0000', '20230129T0000', '20230130T0000', '20230131T0000']], 'domain': 'ERA5T', 'timeResolution': 'daily', 'geometry': {'locationNames': [''], 'type': 'MultiPoint', 'coordinates': [[7.5, 47.75, 363.653]]}}, {'codes': [{'aggregation': 'none', 'dataPerTimeInterval': [{'data': [[12.82]], 'gapFillRatio': 0}], 'unit': 'g/kg', 'level': '0-20 cm', 'code': 817, 'variable': 'Total Nitrogen Content'}], 'timeIntervals': [['Value']], 'domain': 'WISE30', 'timeResolution': 'static', 'geometry': {'locationNames': [''], 'type': 'MultiPoint', 'coordinates': [[7.57501, 47.55834, None]]}}
]

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

# Print the DataFrame
print(weather_df) 